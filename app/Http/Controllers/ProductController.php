<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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

        // Filter by discount percentage (range e.g., 50-59% for 50 query)
        if ($request->filled('discount_percentage')) {
            $discountPercentage = (int) $request->discount_percentage;
            $query->where('discount_percentage', '>=', $discountPercentage)
                  ->where('discount_percentage', '<', $discountPercentage + 10);
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
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_starts_at' => 'nullable|date',
            'discount_ends_at' => 'nullable|date|after_or_equal:discount_starts_at',
            'stock' => 'required|integer|min:0',
            'sugar_level' => 'nullable|integer|min:0|max:100',
            'is_active' => 'boolean',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            'discount_ids' => 'nullable|array',
            'discount_ids.*' => 'exists:discounts,id',
            'variants' => 'nullable|json', // JSON string from FormData
        ];

        $validated = $request->validate($rules);

        // Handle slug
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle images
        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('products', 'public');
            }
            $validated['images'] = $paths;
        }

        // Handle variants (decode JSON string to array for consistency)
        if ($request->filled('variants')) {
            $variants = json_decode($request->variants, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($variants)) {
                throw ValidationException::withMessages([
                    'variants' => 'The variants field must be a valid JSON array.',
                ]);
            }

            // Optional: basic structure validation
            foreach ($variants as $variant) {
                if (!isset($variant['size'], $variant['price']) || !is_numeric($variant['price'])) {
                    throw ValidationException::withMessages([
                        'variants' => 'Each variant must have "size" (string) and "price" (numeric).',
                    ]);
                }
            }

            $validated['variants'] = $variants;
        }

        $product = null;

        DB::transaction(function () use ($validated, &$product) {
            $product = Product::create($validated);

            if (!empty($validated['discount_ids'] ?? [])) {
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

        $rules = [
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|unique:products,slug,' . $id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_starts_at' => 'nullable|date',
            'discount_ends_at' => 'nullable|date|after_or_equal:discount_starts_at',
            'stock' => 'sometimes|integer|min:0',
            'sugar_level' => 'sometimes|integer|min:0|max:100',
            'is_active' => 'boolean',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            'discount_ids' => 'nullable|array',
            'discount_ids.*' => 'exists:discounts,id',
            'variants' => 'nullable|json',
        ];

        $validated = $request->validate($rules);

        // Get old images for cleanup
        $oldImages = $product->images ?? [];

        // Handle new images (replace if uploaded)
        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('products', 'public');
            }
            $validated['images'] = $paths;
        }

        // Handle variants
        if ($request->filled('variants')) {
            $variants = json_decode($request->variants, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($variants)) {
                throw ValidationException::withMessages([
                    'variants' => 'The variants field must be a valid JSON array.',
                ]);
            }

            // Basic structure validation
            foreach ($variants as $variant) {
                if (!isset($variant['size'], $variant['price']) || !is_numeric($variant['price'])) {
                    throw ValidationException::withMessages([
                        'variants' => 'Each variant must have "size" (string) and "price" (numeric).',
                    ]);
                }
            }

            $validated['variants'] = $variants;
        } elseif ($request->has('variants') && $request->variants === null) {
            // Explicitly clear variants
            $validated['variants'] = null;
        }

        DB::transaction(function () use ($product, $validated, $request) {
            $product->update($validated);

            if ($request->has('discount_ids')) {
                $product->discounts()->sync($validated['discount_ids'] ?? []);
            }
        });

        // Clean up old images only if new ones were uploaded
        if ($request->hasFile('images') && !empty($oldImages)) {
            foreach ($oldImages as $path) {
                Storage::disk('public')->delete($path);
            }
        }

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->fresh(['category', 'discounts']),
        ]);
    }

    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);

        // Delete associated images
        if ($product->images) {
            foreach ($product->images as $path) {
                Storage::disk('public')->delete($path);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}