<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Discount;
use App\Models\CustomerPoints;
use App\Services\MoceanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        // Validation (removed 'exists' for discount_code – we check validity in logic)
        $data = $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|min:9|max:20',
            'shipping_address.street' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.province' => 'required|string|max:255',
            'shipping_address.zip' => 'nullable|string|max:20',
            'payment_method' => 'required|string|in:aba_pay', // Add more methods later if needed
            'discount_code' => 'nullable|string',
        ]);

        $user = $request->user();

        // Load cart with items and product (for price & stock)
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 422);
        }

        // Calculate subtotal using CURRENT product prices (as in your original code)
        $subtotal = $cart->items->sum(function ($item) {
            $price = $item->product->discount_price ?? $item->product->price;
            return $price * $item->quantity;
        });

        $shippingFee = 0.00;
        $preTotal = $subtotal + $shippingFee;

        // === DISCOUNT CODE LOGIC ===
        $discountAmount = 0.00;
        $appliedDiscount = null;

        if (!empty($data['discount_code'])) {
            $code = strtoupper(trim($data['discount_code']));

            $discount = Discount::valid()
                ->where('code', $code)
                ->first();

            if (!$discount) {
                return response()->json(['message' => 'Invalid or expired discount code'], 422);
            }

            if ($preTotal < $discount->min_order_amount) {
                return response()->json([
                    'message' => "Minimum order amount of \${$discount->min_order_amount} required for this discount code"
                ], 422);
            }

            $discountAmount = $discount->applyTo($preTotal);
            $appliedDiscount = $discount;
        }

        // Final total (never negative)
        $total = max(0, $preTotal - $discountAmount);

        // Create order + transfer items + decrement stock (all in transaction)
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
                'status' => 'processing', // Payment confirmed at checkout → processing
                'payment_method' => $data['payment_method'],
                'shipping_address' => $data['shipping_address'],
                'payment_ref' => null,
            ]);

            foreach ($cart->items as $cartItem) {
                // Stock check
                $currentPrice = $cartItem->product->discount_price ?? $cartItem->product->price;

                if ($cartItem->product->stock < $cartItem->quantity) {
                    throw new \Exception('Insufficient stock for some products. Please refresh your cart.');
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'sugar_level' => $cartItem->sugar_level ?? null,
                    'unit_price' => $currentPrice,
                    'line_total' => $currentPrice * $cartItem->quantity,
                    'attributes' => $cartItem->attributes ?? null,
                ]);

                // Decrement stock
                $cartItem->product->decrement('stock', $cartItem->quantity);
            }

            // Increment discount usage
            if ($appliedDiscount) {
                $appliedDiscount->incrementUses();
            }

            // Clear cart
            $cart->items()->delete();

            return $order;
        });

        // Load relationships
        $order->load('items.product');

        // Award points (1 point per $1 on final total)
        $pointsEarned = intval(floor($total));
        $userPoints = CustomerPoints::awardPointsForOrder($user->id, $total, $order->id);

        // === SEND THANK-YOU SMS TO CUSTOMER VIA MOCEANAPI ===
        $customerPhone = $order->shipping_address['phone'] ?? null;
        $customerName = $order->shipping_address['name'] ?? 'Customer';

        if ($customerPhone && env('MOCEAN_API_TOKEN') && env('MOCEAN_FROM')) {
            // Normalize phone number to digits only (e.g. 0966463091 -> 855966463091)
            $to = preg_replace('/\D+/', '', $customerPhone);

            // Remove leading zero for local mobile numbers
            if (str_starts_with($to, '0')) {
                $to = substr($to, 1);
            }

            // Ensure it starts with country code 855
            if (!str_starts_with($to, '855')) {
                $to = '855' . $to;
            }

            try {
                $mocean = new MoceanService();
                
                $message = "Hello {$customerName}," .
                          "Thank you for your order. #{$order->order_number}!.".
                          "ORDER TOTAL: \${$order->total}.".
                          "DELIVERY & PAYMENT INFO:".
                          "- We will prepare your order.".
                          "- Our driver will contact you.".
                          "- Please have the exact amount ready.".
                          "- Payment on delivery bong".
                          "Delivery Address:".
                          "{$order->shipping_address['street']}" .
                          "{$order->shipping_address['city']}, {$order->shipping_address['province']}" .
                          "Thank you for choosing Touch Chantha Coffee!";

                $result = $mocean->sendSms($to, $message);
                
                // Log the SMS sending result
                Log::info('SMS sent for order ' . $order->id, ['result' => $result]);
            } catch (\Exception $e) {
                Log::error('SMS send failed for order ' . $order->id . ': ' . $e->getMessage());
                // Silent fail – order is still created
            }
        }

        return response()->json([
            'message' => 'Order created successfully',
            'discount_applied' => $discountAmount > 0 ? $discountAmount : null,
            'order' => $order,
            'points_earned' => $pointsEarned,
            'total_points' => $userPoints->total_points ?? 0,
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