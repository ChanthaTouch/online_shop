<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'subtotal',
        'shipping_fee',
        'total',
        'payment_method',
        'payment_ref',
        'shipping_address',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
