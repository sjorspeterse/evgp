<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CarConfigController extends Controller
{
    /**
     * Expects: 
     * {
     *      ["CHASSIS": "Steel", "OUTERBODY": "Baseline, ...]
     * }
     */
    public function store(Request $request, $username)
    {
        $config = json_decode($request->getContent(), true);

        $key = 'config' . $username;
        Cache::put($key, $config);

        return response($key . ": " . json_encode($config), 201);
    }
}
