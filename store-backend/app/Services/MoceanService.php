<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MoceanService
{
    public function sendSms($to, $text)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('MOCEAN_API_TOKEN'),
            'Accept' => 'application/json',
        ])->asForm()->post('https://rest.moceanapi.com/rest/2/sms', [
            'mocean-from' => env('MOCEAN_FROM'),
            'mocean-to'   => $to,
            'mocean-text' => $text,
        ]);

        if (!$response->successful()) {
            Log::error('Mocean API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'to' => $to,
            ]);

            throw new \Exception('Failed to send SMS: ' . $response->body());
        }

        return $response->json();
    }
}
