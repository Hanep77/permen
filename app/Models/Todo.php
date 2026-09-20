<?php

namespace App\Models;

use App\Enums\Priority;
use App\Enums\TodoStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $project_id
 * @property int|null $goal_id
 * @property int|null $learning_item_id
 * @property string $title
 * @property string $description
 * @property string $status
 * @property string $priority
 * @property Carbon $due_date
 * @property Carbon|null $completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Project|null $project
 * @property-read Goal|null $goal
 * @property-read LearningItem|null $learningItem
 *
 * @method static \Database\Factories\TodoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Todo> whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Todo> whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Todo> whereGoalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Todo> whereStatus($value)
 */
#[Fillable(['user_id', 'project_id', 'goal_id', 'learning_item_id', 'title', 'description', 'status', 'priority', 'due_date', 'completed_at'])]
class Todo extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
            'completed_at' => 'datetime',
            'status' => TodoStatus::class,
            'priority' => Priority::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function goal(): BelongsTo
    {
        return $this->belongsTo(Goal::class);
    }

    public function learningItem(): BelongsTo
    {
        return $this->belongsTo(LearningItem::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', TodoStatus::Todo);
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', TodoStatus::InProgress);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', TodoStatus::Completed);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->where('status', '!=', TodoStatus::Completed);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', Priority::High);
    }
}
