<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointsTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'points',
        'type',
        'description',
        'order_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Scopes
    public function scopeEarned($query)
    {
        return $query->where('type', 'earned');
    }

    public function scopeRedeemed($query)
    {
        return $query->where('type', 'redeemed');
    }
}
