<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller {
    
    public function index(Request $request) {
        $user = $request->user();
        $cart = $user->cart ?? $user->cart()->create();
        return response()->json($cart->load('items.product'));
    }

    public function show(Request $request) {
        $user = $request->user();
        $cart = $user->cart ?? $user->cart()->create();
        return response()->json($cart->load('items.product'));
    }

    public function addItem(Request $request) {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'attributes' => 'nullable|array'
        ]);
        
        $user = $request->user();
        $cart = $user->cart ?? $user->cart()->create();
        $product = Product::findOrFail($data['product_id']);
        
        if ($product->stock < $data['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }
        
        $item = $cart->items()->firstOrCreate(
            ['product_id' => $product->id],
            [
                'quantity' => 0,
                'unit_price' => $product->discount_price ?? $product->price,
                'price' => $product->discount_price ?? $product->price,
                'attributes' => $data['attributes'] ?? null
            ]
        );
        
        $item->quantity += $data['quantity'];
        $item->save();
        
        return response()->json($cart->load('items.product'), 201);
    }

    public function updateItem(Request $request, int $id) {
        $data = $request->validate(['quantity' => 'required|integer|min:1']);
        
        $user = $request->user();
        $cart = $user->cart;
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $item = $cart->items()->where('id', $id)->firstOrFail();
        
        if ($item->product->stock < $data['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }
        
        $item->quantity = $data['quantity'];
        $item->save();
        
        return response()->json($cart->load('items.product'));
    }

    public function removeItem(Request $request, int $id) {
        $user = $request->user();
        $cart = $user->cart;
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cart->items()->where('id', $id)->delete();
        return response()->json(['message' => 'Removed']);
    }

    public function clear(Request $request) {
        $user = $request->user();
        $cart = $user->cart;
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cart->items()->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
