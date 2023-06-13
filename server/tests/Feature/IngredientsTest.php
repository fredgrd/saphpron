<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Ingredient;

class IngredientsTest extends TestCase
{
    public function testCantViewIngredientsForUnauthenticatedUser()
    {
        $this
            ->json('get', '/api/ingredients', [], ['Accept' => 'application/json'])
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    public function testSuccessfulViewIngredients()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        $this
            ->json('get', '/api/ingredients', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(200)
            ->assertJsonIsArray()
            ->assertJsonCount(1);
    }

    public function testCantStoreIngredientForUnauthenticatedUser()
    {
        $this
            ->json('post', '/api/ingredients', [], ['Accept' => 'application/json'])
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    public function testRequiredFieldStoreIngredient()
    {
        $token = parent::createUser()['token'];

        $this
            ->json('post', '/api/ingredients', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The name field is required.',
                'errors' => [
                    'name' => [
                        'The name field is required.'
                    ]
                ]
            ]);
    }

    public function testSuccessfulStoreIngredient()
    {
        $token = parent::createUser()['token'];

        $this
            ->json('post', '/api/ingredients', ['name' => 'Test ingredient'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
            ]);
    }

    public function testRequiredFieldForUpdateIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        $this
            ->json('patch', '/api/ingredients/1', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The name field is required.',
                'errors' => [
                    'name' => [
                        'The name field is required.'
                    ]
                ]
            ]);
    }

    public function testSuccessfulUpdateIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        $this
            ->json('patch', '/api/ingredients/1', ['name' => 'Test ingredient'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(204);
    }

    public function testSuccessfulDeleteIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        $this
            ->json('delete', '/api/ingredients/1', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(204);
    }
}
