<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of active products with optional filters.
     */
    public function index(Request $request)
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with('category')
            ->when($request->category, function ($q, $category) {
                return $q->whereHas('category', function ($c) use ($category) {
                    $c->where('slug', $category);
                });
            })
            ->when($request->search, function ($q, $search) {
                return $q->where('name', 'like', '%' . $search . '%')
                         ->orWhere('description', 'like', '%' . $search . '%');
            })
            ->latest();

        return response()->json($query->paginate(12));
    }

    /**
     * Display the specified product by slug.
     */
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->with('category')
            ->firstOrFail();

        return response()->json($product);
    }

    /**
     * Store a newly created product (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id'   => 'required|exists:categories,id',
            'name'          => 'required|string|max:200',
            'slug'          => 'required|string|unique:products,slug',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'stock'         => 'required|integer|min:0',
            'images'        => 'nullable|array',
            'images.*'      => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active'     => 'sometimes|boolean',
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $images[] = $image->store('products', 'public');
            }
        }

        $validated['images'] = $images;

        $product = Product::create($validated);
        $product->load('category');

        return response()->json($product, 201);
    }

    /**
     * Update the specified product (admin only).
     */
    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id'   => 'sometimes|required|exists:categories,id',
            'name'          => 'sometimes|required|string|max:200',
            'slug'          => 'sometimes|required|string|unique:products,slug,' . $id,
            'description'   => 'nullable|string',
            'price'         => 'sometimes|required|numeric|min:0',
            'stock'         => 'sometimes|required|integer|min:0',
            'images'        => 'nullable|array',
            'images.*'      => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active'     => 'sometimes|boolean',
        ]);

        // Handle image replacement (delete old, upload new)
        if ($request->hasFile('images')) {
            // Delete old images
            if ($product->images) {
                foreach ($product->images as $oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
            }

            $newImages = [];
            foreach ($request->file('images') as $image) {
                $newImages[] = $image->store('products', 'public');
            }
            $validated['images'] = $newImages;
        }

        $product->update($validated);
        $product->load('category');

        return response()->json($product);
    }

    /**
     * Remove the specified product (admin only).
     */
    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);

        // Delete all associated images
        if ($product->images) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}