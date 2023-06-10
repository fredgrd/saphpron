<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
        ]);

        $ingredient = Ingredient::create(['name' => $fields['name']]);

        return response($ingredient, 201);
    }

    public function update(Request $request, string $id)
    {
        $fields = $request->validate([
            'name' => 'required|string',
        ]);

        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response(["message" => "Ingredient not found"], 404);
        }

        $ingredient->update($fields);

        return response()->noContent();
    }

    public function destroy(string $id)
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response(["message" => "Ingredient not found"], 404);
        }

        $result = Ingredient::destroy($id);

        if ($result) {
            return response()->noContent();
        } else {
            return response(["message" => "Ingredient could not be delete"], 500);
        }
    }
}
