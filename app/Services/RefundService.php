<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class RefundService
{
    /**
     * Process a refund for the given order.
     * This is a minimal, gateway-agnostic implementation that simulates
     * a refund if the order has a `payment_ref`. In a real app this
     * should call the payment provider's refund API.
     *
     * @param Order $order
     * @return array ['success' => bool, 'message' => string]
     */
    public static function processRefund(Order $order): array
    {
        if (empty($order->payment_ref)) {
            return ['success' => false, 'message' => 'No payment reference to refund'];
        }

        try {
            // Simulate external refund call here.
            Log::info('Processing refund for order #' . $order->id . ' ref=' . $order->payment_ref);

            // Mark order as refunded and annotate payment_ref to avoid double refunds
            $order->status = 'refunded';
            $order->payment_ref = $order->payment_ref . '-REFUNDED-' . time();
            $order->save();

            return ['success' => true, 'message' => 'Refund processed (simulated)'];
        } catch (\Throwable $ex) {
            Log::error('Refund failed for order #' . $order->id . ': ' . $ex->getMessage());
            return ['success' => false, 'message' => 'Refund failed: ' . $ex->getMessage()];
        }
    }
}
