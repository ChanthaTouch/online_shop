<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'image'];
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
        // or: return $this->image ? asset('storage/' . $this->image) : null;
    }
}
