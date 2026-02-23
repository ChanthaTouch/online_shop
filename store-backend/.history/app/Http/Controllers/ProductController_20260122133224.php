<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index(Request $request) {
        $query = Product::query()->where('is_active', true)
            ->with('category')
            ->when($request->category, fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $request->category)))
            ->when($request->search, fn($q) => $q->where('name','like','%'.$request->search.'%'));
        return response()->json($query->paginate(12));
    }

    public function show(string $slug) {
        $product = Product::where('slug', $slug)->with('category')->firstOrFail();
        return response()->json($product);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:200',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'images' => 'array'
        ]);
        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function update(Request $request, int $id) {
        $product = Product::findOrFail($id);
        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:200',
            'slug' => 'sometimes|string|unique:products,slug,'.$product->id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'images' => 'array',
            'is_active' => 'boolean'
        ]);
        $product->update($data);
        return response()->json($product);
    }

    public function destroy(int $id) {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
