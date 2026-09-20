<?php

namespace App\Http\Requests\Project;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'goal_id' => ['nullable', 'exists:goals,id'],
            'title' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::in(ProjectStatus::values())],
            'start_date' => ['sometimes', 'required', 'date'],
            'target_date' => ['sometimes', 'required', 'date', 'after_or_equal:start_date'],
            'completed_at' => ['nullable', 'datetime'],
        ];
    }
}
