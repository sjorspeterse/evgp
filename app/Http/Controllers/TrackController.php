<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TrackController extends Controller
{
    /**
     * Expects: 
     * {
     *      "track": "Practice" / "Official", 
     * }
     */
    public function store(Request $request)
    {
        $json = json_decode($request->getContent(), true);
        $track = $json['track'];
        Cache::put('track', $track);
        return response($track, 201);
    }
}
