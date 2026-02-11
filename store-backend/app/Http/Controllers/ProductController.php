<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with('category');
        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate($request->integer('per_page', 12));

        return response()->json($products);
    }
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with('category')
            ->firstOrFail();

        return response()->json($product);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_starts_at' => 'nullable|date',
            'discount_ends_at' => 'nullable|date|after_or_equal:discount_starts_at',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            'discount_ids' => 'nullable|array',
            'discount_ids.*' => 'exists:discounts,id',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }

        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('products', 'public');
            }
            $validated['images'] = $paths;
        }

        DB::transaction(function () use ($validated, &$product) {
            $product = Product::create($validated);

            if (!empty($validated['discount_ids'])) {
                $product->discounts()->attach($validated['discount_ids']);
            }
        });

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->fresh(['category', 'discounts']),
        ], 201);
    }
    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|unique:products,slug,' . $id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_starts_at' => 'nullable|date',
            'discount_ends_at' => 'nullable|date|after_or_equal:discount_starts_at',
            'stock' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            'discount_ids' => 'nullable|array',
            'discount_ids.*' => 'exists:discounts,id',
        ]);

        if ($request->hasFile('images')) {
            $paths = [];
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('products', 'public');
            }
            $validated['images'] = $paths;
        }

        DB::transaction(function () use ($product, $validated, $request) {
            $product->update($validated);

            if ($request->has('discount_ids')) {
                $product->discounts()->sync($validated['discount_ids'] ?? []);
            }
        });

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->fresh(['category', 'discounts']),
        ]);
    }
    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);
        if ($product->images) {
            foreach (json_decode($product->images, true) as $path) {
                $filePath = str_replace('/storage/', '', $path);
                Storage::disk('public')->delete($filePath);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}