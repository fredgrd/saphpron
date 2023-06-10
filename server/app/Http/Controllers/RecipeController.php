<?php

namespace App\Http\Controllers;

use App\Models\RecipeStep;
use App\Models\RecipeIngredient;
use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Maybe Return the total count
        // return Recipe.
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'prep_time' => 'required|integer',
            'is_favourite' => 'nullable|boolean',
            'media_url' => 'nullable|string',
            'ingredients' => 'present|array', // Array can be empty
            'ingredients.*.ingredient_id' => 'required|integer',
            'ingredients.*.info' => 'nullable|string',
            'steps' => 'present|array', // Array can be empty
            'steps.*.description' => 'required|string',
            'steps.*.is_important' => 'nullable|boolean',
        ]);

        // Create a recipe
        $user_id = $request->user()->id;
        $recipe = Recipe::create([
            'name' => $fields['name'],
            'description' => isset($fields['description']) ? $fields['description'] : null,
            'prep_time' => $fields['prep_time'],
            'is_favourite' => isset($fields['is_favourite']) ? $fields['is_favourite'] : false,
            'media_url' => isset($fields['media_url']) ? $fields['media_url'] : null,
            'user_id' => $user_id
        ]);

        // Create the recipe ingredients
        foreach ($fields['ingredients'] as $ingredient) {
            RecipeIngredient::create([
                'ingredient_id' => $ingredient['ingredient_id'],
                'recipe_id' => $recipe->id,
                'info' => isset($ingredient['info']) ? $ingredient['info'] : null
            ]);
        }

        // Create the recipe steps
        foreach ($fields['steps'] as $step) {
            RecipeStep::create([
                'description' => $step['description'],
                'recipe_id' => $recipe->id,
                'is_important' => isset($step['is_important']) ? $step['is_important'] : false,
            ]);
        }

        return response(['message' => 'Recipe created!'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
