<?php

namespace Tests;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;

use App\Models\User;
use App\Models\Recipe;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, DatabaseMigrations;

    protected function createUser()
    {
        $user = User::create([
            'name' => 'Federico',
            'email' => 'federico@mail.com',
            'password' => bcrypt('123456')
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    protected function createRecipe(int $count, int $user_id)
    {
        $recipes = Recipe::factory()->count($count)->create([
            'user_id' => $user_id
        ]);

        return $recipes;
    }
}
