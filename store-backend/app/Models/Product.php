<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_price',
        'stock',
        'images',
        'is_active',
        'sku',
        'attributes'
    ];

    protected $casts = [
        'images' => 'array',
        'attributes' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function cartItems() {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }

    // Scope for active products
    public function scopeActive($query) {
        return $query->where('is_active', true);
    }

    // Scope for search
    public function scopeSearch($query, $search) {
        return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
    }
}
