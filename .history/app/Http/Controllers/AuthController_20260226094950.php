<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Mocean; // <--- IMPORTANT: This must be here

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|in:customer,admin',
            'admin_key' => 'nullable|string',
            'phone' => 'nullable|string', // Added phone validation
        ]);

        $role = $request->input('role', 'customer');

        if ($role === 'admin') {
            $adminKey = $request->input('admin_key');
            $validAdminKey = env('ADMIN_REGISTRATION_KEY', 'admin_secret_key_123');

            if (!$adminKey || $adminKey !== $validAdminKey) {
                return response()->json(['error' => 'Invalid admin registration key'], 403);
            }
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Using Hash for security
            'role' => $role,
        ]);

        // --- MOCEAN SMS LOGIC START ---
        try {
            // Only try to send if a phone number is provided
            if ($request->filled('phone')) {
                Mocean::message()->send([
                    'mocean-to'   => $request->phone,
                    'mocean-from' => 'ChanthaCoffee',
                    'mocean-text' => "Hello {$user->name}, welcome to Chantha Coffee! Your account is ready."
                ]);
            }
        } catch (\Exception $e) {
            // We log the error but do NOT stop the registration
            Log::error("Mocean SMS failed: " . $e->getMessage());
        }
        // --- MOCEAN SMS LOGIC END ---

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'customer'
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}