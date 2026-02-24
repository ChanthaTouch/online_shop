<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // In a real app, fetch user orders from DB. Return mock data here.
        $orders = [
            ['id' => 1001, 'status' => 'delivered', 'total' => 23.5],
            ['id' => 1002, 'status' => 'preparing', 'total' => 15.0],
        ];

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $payload = $request->all();

        // Simple mock: return the received order with an id and status
        $order = [
            'id' => rand(2000, 9999),
            'status' => 'received',
            'items' => $payload['items'] ?? [],
            'total' => $payload['total'] ?? 0,
        ];

        return response()->json($order, 201);
    }

    public function show($id)
    {
        // Mock order details
        $order = [
            'id' => (int) $id,
            'status' => 'on_the_way',
            'items' => [ ['id'=>101,'name'=>'Margherita','qty'=>1,'price'=>8.5] ],
            'total' => 8.5,
        ];

        return response()->json($order);
    }
}
