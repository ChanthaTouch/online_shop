<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request) {
        $orders = $request->user()->orders()->with('items.product')->paginate(10);
        return response()->json($orders);
    }

    public function show(Request $request, int $id) {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('items.product')
            ->firstOrFail();
        return response()->json($order);
    }

    public function checkout(Request $request) {
        $data = $request->validate([
            'shipping_address' => 'required|array',
            'payment_method' => 'required|string|in:card,bank_transfer,cash',
            'discount_code' => 'nullable|string',
        ]);

        $user = $request->user();
        $cart = $user->cart;

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        // Calculate totals
        $subtotal = $cart->items->sum(function($item) {
            return $item->price * $item->quantity;
        });

        $discount = 0; // Apply discount code logic here if needed
        $shippingFee = 5.00; // Fixed shipping fee, can be made dynamic
        $total = $subtotal - $discount + $shippingFee;

        // Create order
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-' . date('YmdHis') . rand(1000, 9999),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping_fee' => $shippingFee,
            'total' => $total,
            'status' => 'pending',
            'payment_method' => $data['payment_method'],
            'shipping_address' => $data['shipping_address'],
        ]);

        // Create order items from cart
        foreach ($cart->items as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->unit_price,
                'line_total' => $cartItem->price * $cartItem->quantity,
                'attributes' => $cartItem->attributes,
            ]);
        }

        // Clear cart
        $cart->items()->delete();

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    }

    public function cancel(Request $request, int $id) {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Cannot cancel this order'], 422);
        }

        $order->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Order cancelled']);
    }
}
