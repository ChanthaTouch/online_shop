<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'code',
        'title',
        'description',
        'link',
        'type',
        'value',
        'min_order_amount',
        'max_uses',
        'uses',
        'expires_at',
        'active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'expires_at' => 'datetime',
        'active' => 'boolean',
    ];

    /**
     * Scope a query to only include valid/active discounts.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
    public function scopeValid($query)
    {
        return $query->where('active', true)
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     })
                     ->where(function ($q) {
                         $q->whereNull('max_uses')
                           ->orWhereRaw('uses < max_uses');
                     });
    }

    /**
     * Apply the discount to a total amount.
     *
     * @param  float  $total
     * @return float
     */
    public function applyTo($total)
    {
        if ($this->type === 'percentage') {
            return $total * ($this->value / 100);
        }

        return $this->value; // fixed amount
    }

    /**
     * Increment the usage count of this discount code.
     */
    public function incrementUses()
    {
        $this->increment('uses');
    }
}