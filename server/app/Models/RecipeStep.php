<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeStep extends Model
{
    use HasFactory;

    protected $hidden = ["created_at", "updated_at"];

    protected $fillable = [
        'name',
        'description',
        'is_important',
        'recipe_id'
    ];
}
