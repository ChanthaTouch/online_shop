<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    // GET /categories
    public function index()
    {
        $categories = Category::with('products')->get();
        return response()->json($categories);
    }

    // POST /categories
public function store(Request $request)
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255|unique:categories,name',
        'slug'        => 'nullable|string|max:255|unique:categories,slug',
        'description' => 'nullable|string',
        'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // ← important change
    ]);

    $data = [
        'name'        => $validated['name'],
        'description' => $validated['description'] ?? null,
    ];

    // Auto-generate slug if not provided
    $data['slug'] = $request->filled('slug')
        ? Str::slug($request->input('slug'))
        : Str::slug($validated['name']);

    // Handle image upload
    if ($request->hasFile('image')) {
        if (!$request->file('image')->isValid()) {
            \Log::error('Image upload invalid: ' . $request->file('image')->getErrorMessage());
        }
        $path = $request->file('image')->store('categories', 'public');
        \Log::info('Image stored at: ' . $path);
        $data['image'] = $path;
    }
    $category = Category::create($data);

    return response()->json($category, 201);
}
    // PUT /categories/{id}
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json($category);
    }

    // DELETE /categories/{id}
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted']);
    }

    // CART: GET /cart
    public function cart()
    {
        // Placeholder logic
        return response()->json(['message' => 'Cart contents']);
    }

    // CART: POST /cart/items
    public function addItem(Request $request)
    {
        // Placeholder logic
        return response()->json(['message' => 'Item added to cart']);
    }

    // CART: PUT /cart/items/{id}
    public function updateItem(Request $request, $id)
    {
        // Placeholder logic
        return response()->json(['message' => "Item {$id} updated"]);
    }

    // CART: DELETE /cart/items/{id}
    public function removeItem($id)
    {
        // Placeholder logic
        return response()->json(['message' => "Item {$id} removed"]);
    }

    // CHECKOUT: POST /checkout
    public function createOrder(Request $request)
    {
        // Placeholder logic
        return response()->json(['message' => 'Order created']);
    }

    // ORDERS: GET /orders
    public function orders()
    {
        // Placeholder logic
        return response()->json(['message' => 'List of orders']);
    }

    // ORDERS: GET /orders/{id}
    public function show($id)
    {
        // Placeholder logic
        return response()->json(['message' => "Order {$id} details"]);
    }
}
