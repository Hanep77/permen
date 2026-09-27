<?php

namespace App\Http\Requests\LearningItem;

use App\Enums\LearningItemType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLearningItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'goal_id' => ['nullable', Rule::exists('goals', 'id')->where('user_id', $this->user()->id)],
            'context' => ['nullable', Rule::in(['independent', 'goal'])],
            'title' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'type' => ['required', Rule::in(LearningItemType::values())],
            'start_at' => ['required', 'date'],
            'completed_at' => ['nullable', 'date', 'after_or_equal:start_at'],
        ];
    }
}
