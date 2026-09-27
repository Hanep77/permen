<?php

namespace App\Http\Requests\Resource;

use App\Enums\ResourceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResourceRequest extends FormRequest
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
            'context' => ['nullable', Rule::in(['independent', 'project', 'goal', 'learning_item'])],
            'title' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'url' => ['required', 'url'],
            'type' => ['required', Rule::in(ResourceType::values())],
        ];
    }
}
