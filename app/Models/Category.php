<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'image'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Image is stored as relative path (e.g. "categories/xyz.jpg").
     * Frontend builds full URL from this. No accessor needed for API.
     */
}
