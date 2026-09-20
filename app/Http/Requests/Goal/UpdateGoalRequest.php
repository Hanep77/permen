<?php

namespace App\Http\Requests\Goal;

use App\Enums\GoalStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::in(GoalStatus::values())],
            'start_date' => ['sometimes', 'required', 'date'],
            'target_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'completed_at' => ['nullable', 'datetime'],
        ];
    }
}
