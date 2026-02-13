<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Notifications\OrderRefunded;
use App\Notifications\OrderStatusChanged;
use App\Services\RefundService;
use Illuminate\Http\Request;

class OrderAdminController extends Controller
{
    // List all orders with basic filters
    public function index(Request $request)
    {
        $query = Order::with('items.product', 'user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('order_number', 'like', "%{$q}%")
                    ->orWhereHas('user', function ($u) use ($q) {
                        $u->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%");
                    });
            });
        }

        $orders = $query->paginate(15);

        return response()->json($orders);
    }

    // Show any order
    public function show(int $id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);
        return response()->json($order);
    }

    // Update order status (simple admin action)
    public function updateStatus(Request $request, int $id)
    {
        $data = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,completed,cancelled,refunded'
        ]);

        $order = Order::with('user')->findOrFail($id);

        $old = $order->status;
        $order->status = $data['status'];
        $order->save();

        // Notify customer
        if ($order->user) {
            $order->user->notify(new OrderStatusChanged($order, $old, $order->status));
        }

        // If status indicates refund, attempt refund
        if ($data['status'] === 'refunded') {
            $res = RefundService::processRefund($order);
            if ($res['success']) {
                if ($order->user) {
                    $order->user->notify(new OrderRefunded($order, $order->total));
                }
            }
        }

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }

    // Cancel an order as admin
    public function cancel(int $id)
    {
        $order = Order::with('user')->findOrFail($id);

        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Order is already cancelled'], 422);
        }

        $order->status = 'cancelled';
        $order->save();

        // Notify customer about cancellation
        if ($order->user) {
            $order->user->notify(new OrderStatusChanged($order, 'pending', 'cancelled'));
        }

        // If payment exists, attempt refund
        $refundResult = null;
        if (!empty($order->payment_ref)) {
            $refundResult = RefundService::processRefund($order);
            if ($refundResult['success'] && $order->user) {
                $order->user->notify(new OrderRefunded($order, $order->total));
            }
        }

        return response()->json(['message' => 'Order cancelled by admin', 'order' => $order, 'refund' => $refundResult]);
    }
}
