<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\EstimatedValue;
use App\Enums\OpportunityStatus;
use App\Enums\Priority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOpportunityRequest extends FormRequest
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
            'status' => ['required', Rule::in(OpportunityStatus::values())],
            'source' => ['required', 'string', 'max:255'],
            'priority' => ['required', Rule::in(Priority::values())],
            'estimated_value' => ['required', Rule::in(EstimatedValue::values())],
            'next_action' => ['required', 'string'],
            'due_date' => ['required', 'date'],
        ];
    }
}
