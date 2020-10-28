<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class RaceController extends Controller
{
    public function index() {
        $userId = 0;
        $userName = "Guest";
        if (Auth::check()) {
            $userId = Auth::user()->id;
            $userName = Auth::user()->username;
        }
        if (Gate::allows('logged-in')) {
            $user = array("id" => $userId, "name" => $userName);
            return view('race.index')->with('user', json_encode($user));
        } else {
            return redirect('/public');
        }
    }
}
