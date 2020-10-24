<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class TestController extends Controller
{
    public function index()
    {
        $userId = 0;
        if (Auth::check()) {
            $userId = Auth::user()->id;
        }
        Log::debug("user id: " . $userId);

        return view('test.index')->with('data', json_encode($userId));
    }
}
