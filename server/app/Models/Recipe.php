<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    // Hides fields from return
    protected $hidden = ["created_at", "updated_at", "user_id"];

    protected $fillable = [
        'name',
        'description',
        'prep_time',
        'is_favourite',
        'user_id',
        'media_url'
    ];
}
