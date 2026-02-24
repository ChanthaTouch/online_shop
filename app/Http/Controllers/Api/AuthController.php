<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // For simplicity, return a mock user and token
        $user = [
            'id' => rand(100, 999),
            'name' => $request->input('name', 'Guest'),
            'email' => $request->input('email', 'user@example.com'),
            'role' => $request->input('role', 'customer')
        ];
        return response()->json(['user' => $user, 'token' => 'mock-token']);
    }

    public function login(Request $request)
    {
        // Accept any credentials for development purposes
        $user = [
            'id' => 1,
            'name' => 'Demo User',
            'email' => $request->input('email', 'demo@example.com'),
            'role' => 'customer'
        ];
        return response()->json(['user' => $user, 'token' => 'mock-token']);
    }

    public function getMe(Request $request)
    {
        // Return mock current user data
        // In production, get from authenticated request
        $user = [
            'id' => 1,
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'role' => 'customer'
        ];
        return response()->json(['user' => $user]);
    }

    public function logout(Request $request)
    {
        // In production, revoke token
        return response()->json(['message' => 'Logged out successfully']);
    }
}
