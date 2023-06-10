<?php

namespace App\Http\Controllers;

use App\Models\RecipeStep;
use App\Models\RecipeIngredient;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use App\Services\UnsplashService;

class RecipeController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $recipe = Recipe::select('id', 'name', 'description', 'prep_time', 'is_favourite', 'media_url')
            ->find($id);

        if (!$recipe) {
            return response(["message" => "Recipe not found"], 404);
        }

        $ingredients = RecipeIngredient::where('recipe_id', $id)
            ->join('ingredients', 'recipe_ingredients.ingredient_id', '=', 'ingredients.id')
            ->select('recipe_ingredients.id', 'recipe_ingredients.ingredient_id', 'ingredients.name', 'recipe_ingredients.info',)
            ->get();

        $steps = RecipeStep::where('recipe_id', $id)
            ->select('id', 'description', 'is_important')
            ->get();


        return response([
            "recipe" => $recipe,
            "ingredients" => $ingredients,
            "steps" => $steps
        ], 200);
    }

    /**
     * Display the matching recipe.
     */

    public function search(Request $request, string $mode)
    {
        if (!$request->has('q')) {
            return response(['message' => 'Missing query'], 400);
        }

        $user_id = $request->user()->id;

        // info: Search the recipes infos: name OR description
        // ingrs: Search the recipes matching ingredients
        switch ($mode) {
            case ('info'):
                $queryString = $request->query('q');

                // SELECT * FROM recipes WHERE user_id=$user_id AND (WHERE name ILIKE query OR WHERE description ILIKE query)
                // ILIKE is used because it is case insensitive
                $recipes = Recipe::where('user_id', $user_id)
                    ->where(function ($query) use ($queryString) {
                        $query->where('name', 'ilike', '%' . $queryString . '%')
                            ->orWhere('description', 'ilike', '%' . $queryString . '%');
                    })->get();

                return $recipes;

            case ('ingrs'):
                $query = $request->query('q');

                $recipes = Recipe::where('user_id', $user_id)
                    ->join('recipe_ingredients', 'recipe_ingredients.recipe_id', '=', 'recipes.id')
                    ->join('ingredients', 'recipe_ingredients.ingredient_id', '=', 'ingredients.id')
                    ->whereIn(DB::raw('LOWER(ingredients.name)'), array_map('strtolower', $query))
                    ->select('recipes.id', 'recipes.name', 'recipes.description', 'recipes.prep_time', 'recipes.is_favourite', 'recipes.media_url')
                    ->get();

                return $recipes;
        }
    }

    // RECIPE -------------------------------------------------------------------------

    /**
     * Store a newly created recipe in storage.
     */
    public function storeRecipe(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'prep_time' => 'required|integer',
            'is_favourite' => 'nullable|boolean',
            'media_url' => 'nullable|string',
        ]);

        if (!isset($fields['media_url'])) {
            $access_key = config('services.unsplash.access_key');

            if (!$access_key) {
                throw new RuntimeException(
                    'The Unsplash Access Key must be added to env'
                );
            }

            $unsplashService = new UnsplashService($access_key);
            $photo = $unsplashService->getPlaceholderPhoto();
            $fields['media_url'] = $photo;
        }

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

        return response($recipe, 201);
    }

    /**
     * Update the recipe.
     */
    public function updateRecipe(Request $request, string $id)
    {
        $fields = $request->validate([
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'prep_time' => 'nullable|integer',
            'is_favourite' => 'nullable|boolean',
            'media_url' => 'nullable|string',
        ]);

        $recipe = Recipe::find($id);

        if (!$recipe) {
            return response(["message" => "Recipe not found"], 404);
        }

        $recipe->update($fields);

        return response()->noContent();
    }

    /**
     * Remove the specified recipe from storage.
     */
    public function destroyRecipe(string $id)
    {
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return response(["message" => "Recipe not found"], 404);
        }

        $result = Recipe::destroy($id);

        if ($result) {
            return response()->noContent();
        } else {
            return response(["message" => "Recipe could not be delete"], 500);
        }
    }

    // INGREDIENT -------------------------------------------------------------------------

    /**
     * Store a newly created recipe ingredient in storage.
     */
    public function storeIngredient(Request $request)
    {
        $fields = $request->validate([
            'recipe_id' => 'required|integer',
            'ingredient_id' => 'required|integer',
            'info' => 'nullable|string',
        ]);

        // Create the recipe ingredients
        $ingredient = RecipeIngredient::create([
            'ingredient_id' => $fields['ingredient_id'],
            'recipe_id' => $fields['recipe_id'],
            'info' => isset($fields['info']) ? $fields['info'] : null
        ]);

        return response($ingredient, 201);
    }

    /**
     * Update the recipe ingredient.
     */
    public function updateIngredient(Request $request, string $id)
    {
        $fields = $request->validate([
            'info' => 'required|string', // If you do not submit info then nothing to update
        ]);

        $ingredient = RecipeIngredient::find($id);

        if (!$ingredient) {
            return response(["message" => "Recipe ingredient not found"], 404);
        }

        $ingredient->update($fields);

        return response()->noContent();
    }

    /**
     * Remove the specified recipe ingredient from storage.
     */
    public function destroyIngredient(string $id)
    {
        $ingredient = RecipeIngredient::find($id);

        if (!$ingredient) {
            return response(["message" => "Recipe ingredient not found"], 404);
        }

        $result = RecipeIngredient::destroy($id);

        if ($result) {
            return response()->noContent();
        } else {
            return response(["message" => "Recipe ingredient could not be delete"], 500);
        }
    }

    // STEP -------------------------------------------------------------------------

    /**
     * Store a newly created recipe step in storage.
     */
    public function storeStep(Request $request)
    {
        $fields = $request->validate([
            'recipe_id' => 'required|integer',
            'description' => 'required|string',
            'is_important' => 'nullable|boolean',
        ]);

        // Create the recipe ingredients
        $ingredient = RecipeStep::create([
            'description' => $fields['description'],
            'recipe_id' => $fields['recipe_id'],
            'is_important' => isset($fields['is_important']) ? $fields['is_important'] : false,
        ]);

        return response($ingredient, 201);
    }

    /**
     * Update the recipe step.
     */
    public function updateStep(Request $request, string $id)
    {
        $fields = $request->validate([
            'description' => 'nullable|string',
            'is_important' => 'nullable|boolean',
        ]);

        $step = RecipeStep::find($id);

        if (!$step) {
            return response(["message" => "Recipe step not found"], 404);
        }

        $step->update($fields);

        return response()->noContent();
    }

    /**
     * Remove the specified recipe step from storage.
     */
    public function destroyStep(string $id)
    {
        $step = RecipeStep::find($id);

        if (!$step) {
            return response(["message" => "Recipe step not found"], 404);
        }

        $result = RecipeStep::destroy($id);

        if ($result) {
            return response()->noContent();
        } else {
            return response(["message" => "Recipe step could not be delete"], 500);
        }
    }
}
