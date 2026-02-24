<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'subtotal',
        'discount',
        'shipping_fee',
        'total',
        'payment_method',
        'payment_ref',
        'shipping_address',
        'order_number',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
        'shipping_address' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function items() {
        return $this->hasMany(OrderItem::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }

    // Scopes
    public function scopePending($query) {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query) {
        return $query->where('status', 'completed');
    }
}
