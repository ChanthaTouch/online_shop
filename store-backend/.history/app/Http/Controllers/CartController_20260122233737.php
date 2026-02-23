<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartController extends Controller {
    pu
    public function show(Request $request) {
        $cart = $request->user()->cart()->with('items.product')->first();
        return response()->json($cart);
    }

    public function addItem(Request $request) {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        $cart = $request->user()->cart;
        $product = Product::findOrFail($data['product_id']);
        if ($product->stock < $data['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }
        $item = $cart->items()->firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => 0, 'unit_price' => $product->price]
        );
        $item->quantity += $data['quantity'];
        $item->unit_price = $product->price;
        $item->save();
        return response()->json($cart->load('items.product'), 201);
    }

    public function updateItem(Request $request, int $id) {
        $data = $request->validate(['quantity' => 'required|integer|min:1']);
        $item = $request->user()->cart->items()->where('id', $id)->firstOrFail();
        if ($item->product->stock < $data['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }
        $item->quantity = $data['quantity'];
        $item->save();
        return response()->json($request->user()->cart->load('items.product'));
    }

    public function removeItem(Request $request, int $id) {
        $request->user()->cart->items()->where('id', $id)->delete();
        return response()->json(['message' => 'Removed']);
    }
}
