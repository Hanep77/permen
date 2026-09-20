<?php

namespace App\Policies;

use App\Models\LearningItem;
use App\Models\User;

class LearningItemPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, LearningItem $learningItem): bool
    {
        return $user->id === $learningItem->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, LearningItem $learningItem): bool
    {
        return $user->id === $learningItem->user_id;
    }

    public function delete(User $user, LearningItem $learningItem): bool
    {
        return $user->id === $learningItem->user_id;
    }
}
