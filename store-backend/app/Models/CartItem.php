<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['cart_id', 'product_id', 'quantity', 'price', 'unit_price', 'attributes'];
    
    protected $casts = [
        'attributes' => 'array',
        'price' => 'decimal:2',
        'unit_price' => 'decimal:2',
    ];
    
    public function cart() {
        return $this->belongsTo(Cart::class);
    }
    
    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function getLineTotalAttribute() {
        return $this->price * $this->quantity;
    }
}
