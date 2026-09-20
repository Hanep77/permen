<?php

namespace App\Providers;

use App\Models\Goal;
use App\Models\LearningItem;
use App\Models\Note;
use App\Models\Opportunity;
use App\Models\Project;
use App\Models\Resource;
use App\Models\Todo;
use App\Policies\GoalPolicy;
use App\Policies\LearningItemPolicy;
use App\Policies\NotePolicy;
use App\Policies\OpportunityPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ResourcePolicy;
use App\Policies\TodoPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        $this->configureDefaults();
    }

    protected function registerPolicies(): void
    {
        Gate::policy(Goal::class, GoalPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Opportunity::class, OpportunityPolicy::class);
        Gate::policy(Todo::class, TodoPolicy::class);
        Gate::policy(Note::class, NotePolicy::class);
        Gate::policy(Resource::class, ResourcePolicy::class);
        Gate::policy(LearningItem::class, LearningItemPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
