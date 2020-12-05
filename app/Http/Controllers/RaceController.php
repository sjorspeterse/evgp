<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RaceController extends Controller
{
    public function getCarStateJSON($username)
    {
        $physics_json = Cache::remember(
            $username, 10, function () use ($username) {
                Log::debug("Race Controller: Could not find physics in cache for user " . $username . ", returning empty");
                $stringToReturn = '{}';
                return $stringToReturn;
            });

        return $physics_json;
    }

    public function index() {
        $userId = 0;
        $userName = "Guest";
        if (Auth::check()) {
            $userId = Auth::user()->id;
            $userName = Auth::user()->username;
            $carNr = Auth::user()->car_number;
            $name = Auth::user()->name;
        }
        if (Gate::allows('admin-page')) {
            return view('admin.index');
        }
        if (Gate::allows('logged-in')) {
            $user = array("id" => $userId, "carNr" => $carNr, "name" => $name, "userName" => $userName);
            $physics_state = $this->getCarStateJSON($userName);
            $admin = Cache::rememberForever( "admin", function () { return []; });
            return view('race.index', [
                'user' => json_encode($user),
                'state' => $physics_state,
                'admin' => json_encode($admin)
            ]);
        } else {
            return redirect('/login');
        }
    }
}
