<?php

namespace App\Models;

use App\Enums\GoalStatus;
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
 * @property string $title
 * @property string $description
 * @property string $status
 * @property Carbon $start_date
 * @property Carbon $target_date
 * @property Carbon|null $completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, Project> $projects
 * @property-read Collection<int, Opportunity> $opportunities
 * @property-read Collection<int, Note> $notes
 * @property-read Collection<int, \App\Models\Resource> $resources
 * @property-read Collection<int, Todo> $todos
 * @property-read Collection<int, LearningItem> $learningItems
 *
 * @method static \Database\Factories\GoalFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Goal> whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Goal> whereStatus($value)
 */
#[Fillable(['user_id', 'title', 'description', 'status', 'start_date', 'target_date', 'completed_at'])]
class Goal extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'target_date' => 'date',
            'completed_at' => 'datetime',
            'status' => GoalStatus::class,
        ];
    }

    protected function isActive(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === GoalStatus::Active,
        );
    }

    protected function isCompleted(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === GoalStatus::Completed,
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
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

    public function learningItems(): HasMany
    {
        return $this->hasMany(LearningItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', GoalStatus::Active);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', GoalStatus::Draft);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', GoalStatus::Completed);
    }
}
