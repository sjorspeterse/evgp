<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class RaceController extends Controller
{
    public function index() {
        $userId = 0;
        if (Auth::check()) {
            $userId = Auth::user()->id;
        }
        if (Gate::allows('logged-in')) {
            return view('race.index')->with('data', json_encode($userId));
        } else {
            return redirect('/public');
        }
    }
}
