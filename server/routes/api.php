<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\IngredientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/signup', [AuthController::class, 'signup']);

// Protected routes
Route::group(['middleware'=>['auth:sanctum']], function (){
    // Recipes
    Route::get('/recipes/{id}', [RecipeController::class, 'show']);
    Route::post('/recipes', [RecipeController::class, 'storeRecipe']);
    Route::post('/recipes/ingredient', [RecipeController::class, 'storeIngredient']);
    Route::post('/recipes/step', [RecipeController::class, 'storeStep']);
    Route::patch('/recipes/{id}', [RecipeController::class, 'updateRecipe']);
    Route::patch('/recipes/ingredient/{id}', [RecipeController::class, 'updateIngredient']);
    Route::patch('/recipes/step/{id}', [RecipeController::class, 'updateStep']);
    Route::delete('/recipes/{id}', [RecipeController::class, 'destroyRecipe']);
    Route::delete('/recipes/ingredient/{id}', [RecipeController::class, 'destroyIngredient']);
    Route::delete('/recipes/step/{id}', [RecipeController::class, 'destroyStep']);

    // Ingredients
    Route::post('/ingredients', [IngredientController::class, 'store']);
});

Route::get('/recipes', function (Request $request) {
    return $request->value;
});



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
