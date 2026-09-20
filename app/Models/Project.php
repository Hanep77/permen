<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $goal_id
 * @property string $title
 * @property string $description
 * @property string $status
 * @property Carbon $start_date
 * @property Carbon $target_date
 * @property Carbon|null $completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Goal|null $goal
 * @property-read Collection<int, Note> $notes
 * @property-read Collection<int, \App\Models\Resource> $resources
 * @property-read Collection<int, Todo> $todos
 *
 * @method static \Database\Factories\ProjectFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Project> whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Project> whereGoalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Project> whereStatus($value)
 */
#[Fillable(['user_id', 'goal_id', 'title', 'description', 'status', 'start_date', 'target_date', 'completed_at'])]
class Project extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'target_date' => 'date',
            'completed_at' => 'datetime',
            'status' => ProjectStatus::class,
        ];
    }

    protected function isActive(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === ProjectStatus::Active,
        );
    }

    protected function isCompleted(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === ProjectStatus::Completed,
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function goal(): BelongsTo
    {
        return $this->belongsTo(Goal::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class);
    }

    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', ProjectStatus::Active);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', ProjectStatus::Draft);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', ProjectStatus::Completed);
    }
}
