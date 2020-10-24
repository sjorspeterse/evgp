<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index($team)
    {
        $team = User::findOrFail($team);
        return view('team', [
            'team' => $team,
        ]);
    }
}
