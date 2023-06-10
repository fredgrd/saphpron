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
    Route::post('/recipes', [RecipeController::class, 'store']);

    // Ingredients
    Route::post('/ingredients', [IngredientController::class, 'store']);
});

Route::get('/recipes', function (Request $request) {
    return $request->value;
});



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
