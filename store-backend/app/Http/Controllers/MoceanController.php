<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MoceanController extends Controller
{
    public function dlr(Request $request)
    {
        \Log::info('Mocean DLR received', $request->all());
        return response()->json(['status' => 'ok']);
    }
}
