<?php

namespace App\Http\Requests\Todo;

use App\Enums\Priority;
use App\Enums\TodoStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTodoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['nullable', Rule::exists('projects', 'id')->where('user_id', $this->user()->id)],
            'goal_id' => ['nullable', Rule::exists('goals', 'id')->where('user_id', $this->user()->id)],
            'learning_item_id' => ['nullable', Rule::exists('learning_items', 'id')->where('user_id', $this->user()->id)],
            'title' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::in(TodoStatus::values())],
            'priority' => ['sometimes', 'required', Rule::in(Priority::values())],
            'due_date' => ['sometimes', 'required', 'date'],
            'completed_at' => ['nullable', 'datetime'],
        ];
    }
}
