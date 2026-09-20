<?php

namespace App\Models;

use App\Enums\LearningItemType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property string $type
 * @property Carbon $start_at
 * @property Carbon $completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, Todo> $todos
 *
 * @method static \Database\Factories\LearningItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\LearningItem> whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\LearningItem> whereType($value)
 */
#[Fillable(['user_id', 'title', 'description', 'type', 'start_at', 'completed_at'])]
class LearningItem extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'completed_at' => 'datetime',
            'type' => LearningItemType::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    public function scopeInProgress($query)
    {
        return $query->whereNull('completed_at');
    }
}
