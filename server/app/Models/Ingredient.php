<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;

    protected $hidden = ["created_at", "updated_at", 'user_id'];

    protected $fillable = [
        'name',
        'user_id',
    ];
}
