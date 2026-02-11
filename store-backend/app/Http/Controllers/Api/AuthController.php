<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // For simplicity, return a mock user and token
        $user = ['id' => rand(100,999), 'name' => $request->input('name','Guest')];
        return response()->json(['user' => $user, 'token' => 'mock-token']);
    }

    public function login(Request $request)
    {
        // Accept any credentials for development purposes
        $user = ['id' => 1, 'name' => 'Demo User'];
        return response()->json(['user' => $user, 'token' => 'mock-token']);
    }
}
