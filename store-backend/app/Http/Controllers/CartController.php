<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * GET /api/cart - Show user's cart
     */
    public function index()
    {
        try {
            $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
            $cart->load('items.product');

            $items = $cart->items->map(function ($item) {
                $product = $item->product;
                $price = $product ? ($product->discount_price ?? $product->price ?? 0) : 0;

                return [
                    'id'          => $item->id,
                    'product_id'  => $item->product_id,
                    'quantity'    => $item->quantity,
                    'product'     => $product ? [
                        'id'              => $product->id,
                        'name'            => $product->name,
                        'slug'            => $product->slug ?? null,
                        'price'           => (float) $price,
                        'discount_price'  => $product->discount_price ? (float) $product->discount_price : null,
                        'images'          => $product->images ?? $product->image_urls ?? [],
                        'primary_image'   => $product->primary_image ?? null,
                        'stock'           => $product->stock ?? null,
                    ] : null,
                ];
            });

            return response()->json([
                'id'           => $cart->id,
                'user_id'      => $cart->user_id,
                'items'        => $items,
                'total'        => $items->sum(fn($i) => ($i['product']['price'] ?? 0) * $i['quantity']),
                'total_items'  => $items->sum('quantity'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load cart',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/cart/items - Add item to cart
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock <= 0) {
            return response()->json(['message' => 'This product is currently out of stock.'], 422);
        }

        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);

        $currentInCart = $cart->items()->where('product_id', $product->id)->sum('quantity');
        $totalAfterAdd = $currentInCart + $request->quantity;

        if ($totalAfterAdd > $product->stock) {
            $remaining = $product->stock - $currentInCart;
            return response()->json([
                'message' => "Only {$remaining} more can be added. You already have {$currentInCart} in your cart."
            ], 422);
        }

        $cartItem = CartItem::firstOrNew([
            'cart_id'    => $cart->id,
            'product_id' => $product->id,
        ]);

        $cartItem->quantity = ($cartItem->exists ? $cartItem->quantity : 0) + $request->quantity;
        $cartItem->save();

        return $this->index();
    }

    /**
     * PUT /api/cart/items/{id} - Update item quantity
     */
    public function updateItem(Request $request, $id)
    {
        $item = CartItem::where('id', $id)
            ->whereHas('cart', fn($q) => $q->where('user_id', auth()->id()))
            ->firstOrFail();

        $validated = $request->validate(['quantity' => 'required|integer|min:1']);

        if ($validated['quantity'] > $item->product->stock) {
            return response()->json([
                'message' => "Maximum quantity available is {$item->product->stock}"
            ], 422);
        }

        $item->update(['quantity' => $validated['quantity']]);

        return $this->index();
    }

    /**
     * DELETE /api/cart/items/{id} - Remove item from cart
     */
    public function removeItem($id)
    {
        CartItem::where('id', $id)
            ->whereHas('cart', fn($q) => $q->where('user_id', auth()->id()))
            ->delete();

        return $this->index();
    }

    /**
     * POST /api/cart/clear - Clear entire cart
     */
    public function clear()
    {
        $cart = Cart::where('user_id', auth()->id())->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json(['message' => 'Cart cleared']);
    }
}