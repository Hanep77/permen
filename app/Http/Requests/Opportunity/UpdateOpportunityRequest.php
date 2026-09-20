<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\EstimatedValue;
use App\Enums\OpportunityStatus;
use App\Enums\Priority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'goal_id' => ['nullable', Rule::exists('goals', 'id')->where('user_id', $this->user()->id)],
            'title' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', Rule::in(OpportunityStatus::values())],
            'source' => ['sometimes', 'required', 'string', 'max:255'],
            'priority' => ['sometimes', 'required', Rule::in(Priority::values())],
            'estimated_value' => ['sometimes', 'required', Rule::in(EstimatedValue::values())],
            'next_action' => ['sometimes', 'required', 'string'],
            'due_date' => ['sometimes', 'required', 'date'],
        ];
    }
}
