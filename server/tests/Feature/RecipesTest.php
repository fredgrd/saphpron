<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\User;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\RecipeStep;

class RecipesTest extends TestCase
{
    public function testCantStoreRecipeForUnauthenticatedUser()
    {
        $this
            ->json('post', '/api/recipes', [], ['Accept' => 'application/json'])
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    public function testRequiredFieldsToStoreRecipe()
    {
        $token = parent::createUser()['token'];

        $this
            ->json('post', '/api/recipes', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                "message" => "The name field is required. (and 1 more error)",
                "errors" => [
                    "name" => [
                        "The name field is required."
                    ],
                    "prep_time" => [
                        "The prep time field is required."
                    ]
                ]
            ]);
    }

    public function testSuccessfulStoreRecipe()
    {
        $recipe_details = [
            'name' => 'Cacio e Pepe',
            'description' => 'A mejo pasta',
            'prep_time' => 29,
            'is_favourite' => false
        ];

        $token = parent::createUser()['token'];

        $this
            ->json('post', '/api/recipes', $recipe_details, ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'prep_time',
                'is_favourite'
            ]);
    }

    public function testCantUpdateRecipe()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        $this
            ->json('patch', '/api/recipes/100', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(404)
            ->assertJson([
                "message" => "Recipe not found",
            ]);
    }

    public function testSuccessfulUpdateRecipe()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        $this
            ->json('patch', '/api/recipes/1', ['name'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'prep_time',
                'is_favourite'
            ]);
    }

    public function testCantDeleteRecipe()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        $this
            ->json('delete', '/api/recipes/100', ['name'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(404);
    }

    public function testSuccessfulDeleteRecipe()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        $this
            ->json('delete', '/api/recipes/1', ['name'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(204);
    }

    public function testCantShowRecipesToUnauthenticatedUser()
    {
        $this
            ->json('get', '/api/recipes', [], ['Accept' => 'application/json'])
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    public function testSuccessfulShowRecipes()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        $recipes = parent::createRecipe(10, $user['id']);;

        $this
            ->json('get', '/api/recipes', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(200)
            ->assertJsonIsArray()
            ->assertJsonCount(count($recipes))
            ->assertJsonStructure(['*' => [
                'id',
                'name',
                'description',
                'prep_time',
                'is_favourite',
                'media_url'
            ],]);
    }

    public function testCantShowRecipeWithWrongId()
    {
        $token = parent::createUser()['token'];

        $this
            ->json('get', '/api/recipes/100', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(404)
            ->assertJson([
                'message' => 'Recipe not found'
            ]);
    }

    public function testSuccessfulShowRecipe()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);;

        $this
            ->json('get', '/api/recipes/1', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(200)
            ->assertJsonStructure([
                'recipe',
                'ingredients',
                'steps'
            ]);
    }

    public function testSuccessfulSearchInfoRecipe()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        $recipe = parent::createRecipe(1, $user['id']);;
        $recipe_name = $recipe[0]['name'];
        $recipe_word = strtok($recipe_name, " ")[0];

        $this
            ->json('get', "/api/recipes/search/info?q={$recipe_word}", [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(200)
            ->assertJsonIsArray()
            ->assertJsonCount(1)
            ->assertJsonStructure(['*' => [
                'id',
                'name',
                'description',
                'prep_time',
                'is_favourite',
                'media_url'
            ],]);
    }

    public function testRequiredFieldsToStoreRecipeIngredient()
    {
        $creds = parent::createUser();
        $token = $creds['token'];

        $this
            ->json('post', '/api/recipes/ingredient', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The recipe id field is required. (and 1 more error)',
                'errors' => [
                    'recipe_id' => [
                        'The recipe id field is required.'
                    ],
                    'ingredient_id' => [
                        'The ingredient id field is required.'
                    ]
                ]
            ]);
    }

    public function testSuccessfullStoreRecipeIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        $details = [
            'recipe_id' => 1,
            'ingredient_id' => 1,
            'info' => '400 grammi'
        ];

        $this
            ->json('post', '/api/recipes/ingredient', $details, ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'info',
                'recipe_id'
            ]);
    }

    public function testRequiredFieldUpdateRecipeIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        $this
            ->json('patch', '/api/recipes/ingredient/1', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The info field is required.',
                'errors' => [
                    'info' => [
                        'The info field is required.'
                    ]
                ]
            ]);
    }

    public function testSuccessfulUpdateRecipeIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        RecipeIngredient::create([
            'recipe_id' => 1,
            'ingredient_id' => 1,
            'info' => 'Test'
        ]);

        $this
            ->json('patch', '/api/recipes/ingredient/1', ['info' => 'Test Done'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201);
    }

    public function testSuccessfulDeleteRecipeIngredient()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        Ingredient::create(['name' => 'Test', 'user_id' => $user['id']]);

        RecipeIngredient::create([
            'recipe_id' => 1,
            'ingredient_id' => 1,
            'info' => 'Test'
        ]);

        $this
            ->json('delete', '/api/recipes/ingredient/1', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(204);
    }

    public function testRequiredFieldsToStoreRecipeStep()
    {
        $creds = parent::createUser();
        $token = $creds['token'];

        $this
            ->json('post', '/api/recipes/step', [], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJson(['message' => 'The recipe id field is required. (and 1 more error)']);
    }

    public function testSuccessfulStoreRecipeStep()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        $details = [
            'recipe_id' => 1,
            'description' => 'Test'
        ];

        $this
            ->json('post', '/api/recipes/step', $details, ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'recipe_id',
                'is_important',
                'description'
            ]);
    }

    public function testSuccessfulUpdateRecipeStep()
    {
        $creds = parent::createUser();
        $user = $creds['user'];
        $token = $creds['token'];

        parent::createRecipe(1, $user['id']);

        RecipeStep::create([
            'recipe_id' => 1,
            'is_important' => false,
            'description' => 'Test'
        ]);

        $this
            ->json('patch', '/api/recipes/step/1', ['description' => 'Test Done'], ['Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json'])
            ->assertStatus(201);
    }
}
