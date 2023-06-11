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
Route::post('/signin', [AuthController::class, 'signin']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Auth
    Route::get('/user', [AuthController::class, 'fetch']);
    Route::post('/signout', [AuthController::class, 'signout']);

    // Recipes
    Route::get('/recipes', [RecipeController::class, 'showAll']);
    Route::get('/recipes/{id}', [RecipeController::class, 'show']);
    Route::get('/recipes/search/{mode}', [RecipeController::class, 'search']);
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
    Route::get('/ingredients', [IngredientController::class, 'showAll']);
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::patch('/ingredients/{id}', [IngredientController::class, 'update']);
    Route::delete('/ingredients/{id}', [IngredientController::class, 'destroy']);
});