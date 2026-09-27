<?php

namespace App\Models;

use App\Enums\ResourceType;
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
 * @property string $url
 * @property string $type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Project|null $project
 * @property-read Goal|null $goal
 * @property-read LearningItem|null $learningItem
 *
 * @method static \Database\Factories\ResourceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Resource> whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Resource> whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Resource> whereGoalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<\App\Models\Resource> whereLearningItemId($value)
 */
#[Fillable(['user_id', 'project_id', 'goal_id', 'learning_item_id', 'title', 'description', 'url', 'type'])]
class Resource extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'type' => ResourceType::class,
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
}
