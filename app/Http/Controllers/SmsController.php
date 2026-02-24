<?php

namespace App\Http\Controllers;

use App\Services\MoceanService;
use Illuminate\Http\Request;

class SmsController extends Controller
{
    /**
     * Send SMS to a custom phone number
     * Used for testing or manual sending
     */
    public function send(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:9|max:20',
            'message' => 'required|string|max:500',
        ]);

        try {
            $mocean = new MoceanService();
            $result = $mocean->sendSms($request->phone, $request->message);
            
            return response()->json([
                'success' => true,
                'message' => 'SMS sent successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send SMS: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Test endpoint to verify SMS service is working
     */
    public function test()
    {
        if (!env('MOCEAN_API_TOKEN') || !env('MOCEAN_FROM')) {
            return response()->json([
                'success' => false,
                'message' => 'MOCEAN_API_TOKEN or MOCEAN_FROM not configured',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'SMS service is properly configured',
            'mocean_from' => env('MOCEAN_FROM'),
        ]);
    }
}
