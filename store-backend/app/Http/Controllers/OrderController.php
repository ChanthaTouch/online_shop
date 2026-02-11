<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function show(Request $request, int $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('items.product')
            ->firstOrFail();
        return response()->json($order);
    }

    public function checkout(Request $request)
    {
        // Validation with sub-fields for shipping_address and discount_code
        $data = $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|min:9|max:20',
            'shipping_address.street' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.province' => 'required|string|max:255',
            'shipping_address.zip' => 'nullable|string|max:20',
            'payment_method' => 'required|string|in:aba_pay',
            'discount_code' => 'nullable|string|exists:discounts,code', // Must exist in DB if provided
        ]);

        $user = $request->user();

        // Load user's cart with items and eager-load products
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 422);
        }

        // Calculate subtotal using current product prices
        $subtotal = $cart->items->sum(function ($item) {
            $price = $item->product->discount_price ?? $item->product->price;
            return $price * $item->quantity;
        });

        $shippingFee = 0.00;
        $total = $subtotal + $shippingFee;

        // === DISCOUNT CODE LOGIC ===
        $discountAmount = 0.00;
        $appliedDiscount = null;

        if (!empty($data['discount_code'])) {
            $code = strtoupper(trim($data['discount_code'])); // Case-insensitive

            $discount = Discount::valid()
                ->where('code', $code)
                ->first();

            if (!$discount) {
                return response()->json(['message' => 'Invalid or expired discount code'], 422);
            }

            if ($total < $discount->min_order_amount) {
                return response()->json([
                    'message' => "Minimum order amount of \${$discount->min_order_amount} required for this discount code"
                ], 422);
            }

            $discountAmount = $discount->applyTo($total);
            $total -= $discountAmount;
            $appliedDiscount = $discount;
        }

        // Ensure total is never negative
        $total = max(0, $total);

        // Create order inside transaction for data integrity
        $order = DB::transaction(function () use (
            $user, $data, $subtotal, $discountAmount, $shippingFee, $total, $cart, $appliedDiscount
        ) {
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'subtotal' => $subtotal,
                'discount' => $discountAmount,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
                'shipping_address' => $data['shipping_address'],
                'payment_ref' => null,
            ]);

            // Transfer cart items to order items
            foreach ($cart->items as $cartItem) {
                $unitPrice = $cartItem->product->discount_price ?? $cartItem->product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $unitPrice * $cartItem->quantity,
                    'attributes' => $cartItem->attributes ?? null,
                ]);
            }

            // Increment discount usage if applied
            if ($appliedDiscount) {
                $appliedDiscount->incrementUses();
            }

            // Clear the cart
            $cart->items()->delete();

            return $order;
        });

        // Load relationships for response
        $order->load('items.product');

        return response()->json([
            'message' => 'Order created successfully',
            'discount_applied' => $discountAmount > 0 ? $discountAmount : null,
            'order' => $order
        ], 201);
    }

    public function cancel(Request $request, int $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be cancelled'], 422);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Order cancelled successfully']);
    }
}