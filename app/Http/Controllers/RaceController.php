<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RaceController extends Controller
{
    public function index() {
        if (Gate::allows('logged-in')) {
            return view('race.index');
        } else {
            return redirect('/public');
        }
    }
}
