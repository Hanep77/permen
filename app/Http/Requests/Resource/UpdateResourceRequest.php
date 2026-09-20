<?php

namespace App\Http\Requests\Resource;

use App\Enums\ResourceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResourceRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'url' => ['sometimes', 'required', 'url'],
            'type' => ['sometimes', 'required', Rule::in(ResourceType::values())],
        ];
    }
}
