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

        $ingredient = Ingredient::create(['name'=>$fields['name']]);

        return response($ingredient, 201);
    }

    // Update
}
