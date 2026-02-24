<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerPoints extends Model
{
    protected $table = 'customer_points';
    
    protected $fillable = [
        'user_id',
        'total_points',
        'earned_points',
        'redeemed_points',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(PointsTransaction::class, 'user_id', 'user_id');
    }

    /**
     * Award points to user
     * Points ratio: 1 point per $1 spent
     */
    public static function awardPointsForOrder($userId, $orderAmount, $orderId)
    {
        $points = intval(floor($orderAmount)); // 1 point = $1
        
        // Get or create user points
        $userPoints = self::firstOrCreate(['user_id' => $userId]);
        
        // Update totals
        $userPoints->total_points += $points;
        $userPoints->earned_points += $points;
        $userPoints->save();
        
        // Record transaction
        PointsTransaction::create([
            'user_id' => $userId,
            'points' => $points,
            'type' => 'earned',
            'description' => 'Points earned from order',
            'order_id' => $orderId,
        ]);
        
        return $userPoints;
    }

    /**
     * Redeem points from user
     */
    public static function redeemPoints($userId, $points, $description = 'Point redemption')
    {
        $userPoints = self::where('user_id', $userId)->firstOrFail();
        
        if ($userPoints->total_points < $points) {
            throw new \Exception('Insufficient points');
        }
        
        // Update totals
        $userPoints->total_points -= $points;
        $userPoints->redeemed_points += $points;
        $userPoints->save();
        
        // Record transaction
        PointsTransaction::create([
            'user_id' => $userId,
            'points' => $points,
            'type' => 'redeemed',
            'description' => $description,
        ]);
        
        return $userPoints;
    }
}
