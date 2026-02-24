<?php

namespace App\Http\Controllers;

use App\Models\CustomerPoints;
use App\Models\PointsTransaction;
use Illuminate\Http\Request;

class PointsController extends Controller
{
    /**
     * GET /api/points - Get user's points balance
     */
    public function getBalance(Request $request)
    {
        $user = $request->user();
        $points = CustomerPoints::where('user_id', $user->id)->first();

        if (!$points) {
            $points = CustomerPoints::create(['user_id' => $user->id]);
        }

        return response()->json([
            'user_id' => $user->id,
            'total_points' => $points->total_points,
            'earned_points' => $points->earned_points,
            'redeemed_points' => $points->redeemed_points,
        ]);
    }

    /**
     * GET /api/points/history - Get user's points transaction history
     */
    public function getHistory(Request $request)
    {
        $user = $request->user();
        $limit = $request->query('limit', 20);
        
        $transactions = PointsTransaction::where('user_id', $user->id)
            ->with('order')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'points' => $transaction->points,
                    'type' => $transaction->type,
                    'description' => $transaction->description,
                    'order_id' => $transaction->order_id,
                    'order_number' => $transaction->order?->order_number,
                    'created_at' => $transaction->created_at,
                ];
            });

        return response()->json([
            'total_count' => PointsTransaction::where('user_id', $user->id)->count(),
            'transactions' => $transactions,
        ]);
    }

    /**
     * POST /api/points/redeem - Redeem points (admin only or for discount)
     */
    public function redeem(Request $request)
    {
        $request->validate([
            'points' => 'required|integer|min:1',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $user = $request->user();
            $points = CustomerPoints::redeemPoints(
                $user->id,
                $request->points,
                $request->description ?? 'Points redeemed for discount'
            );

            return response()->json([
                'message' => 'Points redeemed successfully',
                'points_redeemed' => $request->points,
                'remaining_points' => $points->total_points,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * GET /api/points/stats - Get points statistics
     */
    public function getStats(Request $request)
    {
        $user = $request->user();
        $points = CustomerPoints::where('user_id', $user->id)->first();

        if (!$points) {
            $points = CustomerPoints::create(['user_id' => $user->id]);
        }

        $monthlyEarned = PointsTransaction::where('user_id', $user->id)
            ->where('type', 'earned')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('points');

        $monthlyRedeemed = PointsTransaction::where('user_id', $user->id)
            ->where('type', 'redeemed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('points');

        return response()->json([
            'current_balance' => $points->total_points,
            'lifetime_earned' => $points->earned_points,
            'lifetime_redeemed' => $points->redeemed_points,
            'monthly_earned' => $monthlyEarned,
            'monthly_redeemed' => $monthlyRedeemed,
        ]);
    }
}
