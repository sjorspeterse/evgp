<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminController extends Controller
{
    public function index() {
        if (Gate::allows('admin-page')) {
            return view('admin.index');
        } else {
            return redirect('/public');
        }
    }
}
