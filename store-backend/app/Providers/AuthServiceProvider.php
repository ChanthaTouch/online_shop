<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('manage-catalog', function (User $user) {

            $role = $user->role ?? '';

            // Debug log
            \Log::info('Gate manage-catalog called for user #' . $user->id . ' role=' . $role);

            return strtolower(trim($role)) === 'admin';
        });
    }
}