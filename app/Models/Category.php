<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'image'];

    protected $appends = ['image_url'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Return full URL for the category image
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->image
                ? url('storage/' . ltrim($this->image, '/'))
                : null
        );
    }
}
