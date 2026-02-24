<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckoutController extends Controller {
    public function createOrder(Request $request) {
        $data = $request->validate([
            'shipping_address' => 'required|array',
            'shipping_fee' => 'nullable|numeric|min:0'
        ]);
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $subtotal = $cart->items->sum(fn($i) => $i->quantity * $i->unit_price);
        $shipping = $data['shipping_fee'] ?? 0;
        $total = $subtotal + $shipping;

        DB::transaction(function () use ($user, $cart, $subtotal, $shipping, $total, $data) {
            $order = $user->orders()->create([
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_fee' => $shipping,
                'total' => $total,
                'shipping_address' => $data['shipping_address'],
            ]);

            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new \RuntimeException('Stock changed—please update cart');
                }
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->quantity * $item->unit_price,
                ]);
                $item->product->decrement('stock', $item->quantity);
            }

            $cart->items()->delete(); // clear cart
        });

        return response()->json(['message' => 'Order created'], 201);
    }
}
