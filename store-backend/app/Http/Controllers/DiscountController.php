<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DiscountController extends Controller
{
    /**
     * List all discounts (admin)
     */
    public function index()
    {
        $discounts = Discount::latest()->paginate(20);
        return response()->json($discounts);
    }

    /**
     * Show single discount (admin)
     */
    public function show($id)
    {
        $discount = Discount::findOrFail($id);
        return response()->json($discount);
    }

    /**
     * Create new discount code (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:discounts,code',
            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after:now',
            'active' => 'sometimes|boolean',
        ]);

        $discount = Discount::create($validated);

        return response()->json([
            'message' => 'Discount created',
            'discount' => $discount
        ], 201);
    }

    /**
     * Update discount (admin)
     */
    public function update(Request $request, $id)
    {
        $discount = Discount::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|string|max:255|unique:discounts,code,' . $id,
            'type' => ['sometimes', Rule::in(['percentage', 'fixed'])],
            'value' => 'sometimes|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after:now',
            'active' => 'sometimes|boolean',
        ]);

        $discount->update($validated);

        return response()->json([
            'message' => 'Discount updated',
            'discount' => $discount->fresh()
        ]);
    }

    /**
     * Delete discount (admin)
     */
    public function destroy($id)
    {
        $discount = Discount::findOrFail($id);
        $discount->delete();

        return response()->json(['message' => 'Discount deleted']);
    }

    /**
     * Apply discount code (public - for cart/checkout)
     */
    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ]);

        $discount = Discount::where('code', $request->code)
            ->valid()  // uses your scopeValid()
            ->first();

        if (!$discount) {
            return response()->json(['error' => 'Invalid or expired code'], 400);
        }
  
        $amount = $discount->applyTo(100);

        return response()->json([
            'success' => true,
            'code' => $discount->code,
            'discount_amount' => $amount,
            'message' => 'Discount applied'
        ]);
    }
}