<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'sugar_level',
        'images',
        'discount_price',
        'discount_percentage',
        'discount_starts_at',
        'discount_ends_at',
        'is_active',
        'variants'
    ];

    protected $casts = [
        'images' => 'array',
        'variants' => 'array',
        'is_active' => 'boolean',

        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',

        'discount_starts_at' => 'datetime',
        'discount_ends_at' => 'datetime',
    ];

    protected $appends = [
        'primary_image',
        'image_urls',
        'is_on_sale',
        'final_price',
    ];

    /* ===============================
        AUTO DISCOUNT CALCULATION 🔥
       =============================== */

    protected static function booted()
    {
        static::saving(function (Product $product) {

            // Normalize empty values
            if ($product->discount_percentage <= 0) {
                $product->discount_percentage = null;
            }

            if ($product->discount_percentage) {
                $product->discount_price = round(
                    $product->price - ($product->price * $product->discount_percentage / 100),
                    2
                );
            } else {
                $product->discount_price = null;
            }

        });
    }

    /* ===============================
        RELATIONSHIPS
       =============================== */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class);
    }

    /* ===============================
        IMAGE ACCESSORS
       =============================== */

    protected function primaryImage(): Attribute
    {
        return Attribute::make(
            get: fn () =>
                isset($this->images[0])
                    ? asset('storage/' . ltrim($this->images[0], '/'))
                    : null
        );
    }

    protected function imageUrls(): Attribute
    {
        return Attribute::make(
            get: fn () =>
                collect($this->images ?? [])
                    ->map(fn ($p) => asset('storage/' . ltrim($p, '/')))
                    ->toArray()
        );
    }

    /* ===============================
        DISCOUNT ACCESSORS
       =============================== */

    protected function isOnSale(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->discount_starts_at || !$this->discount_ends_at) {
                    return false;
                }

                return now()->between(
                    $this->discount_starts_at,
                    $this->discount_ends_at
                );
            }
        );
    }

    protected function finalPrice(): Attribute
    {
        return Attribute::make(
            get: fn () =>
                $this->is_on_sale && $this->discount_price
                    ? $this->discount_price
                    : $this->price
        );
    }
}
