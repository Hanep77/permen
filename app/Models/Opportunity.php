<?php

namespace App\Models;

use App\Enums\EstimatedValue;
use App\Enums\OpportunityStatus;
use App\Enums\Priority;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $goal_id
 * @property string $title
 * @property string $description
 * @property string $status
 * @property string $source
 * @property string $priority
 * @property string $estimated_value
 * @property string $next_action
 * @property Carbon $due_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Goal|null $goal
 *
 * @method static \Database\Factories\OpportunityFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Opportunity> whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Opportunity> whereGoalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Opportunity> whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Opportunity> wherePriority($value)
 */
#[Fillable(['user_id', 'goal_id', 'title', 'description', 'status', 'source', 'priority', 'estimated_value', 'next_action', 'due_date'])]
class Opportunity extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
            'status' => OpportunityStatus::class,
            'priority' => Priority::class,
            'estimated_value' => EstimatedValue::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function goal(): BelongsTo
    {
        return $this->belongsTo(Goal::class);
    }

    public function scopeNew($query)
    {
        return $query->where('status', OpportunityStatus::New);
    }

    public function scopeConsidering($query)
    {
        return $query->where('status', OpportunityStatus::Considering);
    }

    public function scopePursuing($query)
    {
        return $query->where('status', OpportunityStatus::Pursuing);
    }

    public function scopeWon($query)
    {
        return $query->where('status', OpportunityStatus::Won);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', Priority::High);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())->whereNotIn('status', [
            OpportunityStatus::Won,
            OpportunityStatus::Rejected,
            OpportunityStatus::Expired,
        ]);
    }
}
