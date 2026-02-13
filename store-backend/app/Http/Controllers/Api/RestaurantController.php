<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index()
    {
        // Sample static list — replace with DB queries as needed
        $data = [
            ['id' => 1, 'name' => 'Corner Pizza', 'cuisine' => 'Italian'],
            ['id' => 2, 'name' => 'Sushi Express', 'cuisine' => 'Japanese'],
            ['id' => 3, 'name' => 'Veggie Delight', 'cuisine' => 'Vegetarian'],
        ];

        return response()->json($data);
    }

    public function show($id)
    {
        // Return a single restaurant by ID
        $restaurants = [
            1 => ['id' => 1, 'name' => 'Corner Pizza', 'cuisine' => 'Italian', 'rating' => 4.5],
            2 => ['id' => 2, 'name' => 'Sushi Express', 'cuisine' => 'Japanese', 'rating' => 4.7],
            3 => ['id' => 3, 'name' => 'Veggie Delight', 'cuisine' => 'Vegetarian', 'rating' => 4.3],
        ];

        if (isset($restaurants[$id])) {
            return response()->json($restaurants[$id]);
        }

        return response()->json(['error' => 'Restaurant not found'], 404);
    }

    public function menu($id)
    {
        // Simple static menus keyed by restaurant id
        $menus = [
            1 => [
                ['id' => 101, 'name' => 'Margherita', 'price' => 8.5, 'description' => 'Classic cheese pizza'],
                ['id' => 102, 'name' => 'Pepperoni', 'price' => 9.5, 'description' => 'Spicy pepperoni'],
            ],
            2 => [
                ['id' => 201, 'name' => 'California Roll', 'price' => 6.0, 'description' => 'Crab & avocado'],
                ['id' => 202, 'name' => 'Salmon Sashimi', 'price' => 12.0, 'description' => 'Fresh salmon slices'],
            ],
            3 => [
                ['id' => 301, 'name' => 'Falafel Wrap', 'price' => 7.0, 'description' => 'Chickpea falafel'],
            ],
        ];

        return response()->json($menus[$id] ?? []);
    }
}
