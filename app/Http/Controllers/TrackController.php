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
        $admin = Cache::rememberForever( "admin", function () { return []; });
        $admin['track'] = $track;
        Cache::put('admin', $admin);

        return response($track, 201);
    }
}
