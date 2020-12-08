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
        $physics_json = Cache::rememberForever(
            $username, function () use ($username) {
                Log::debug("Race Controller: Could not find physics in cache for user " . $username . ", returning empty");
                $stringToReturn = '{}';
                return $stringToReturn;
            });

        return $physics_json;
    }

    public function index() {
        $userId = 0;
        $userName = "Guest";
        $admin = Cache::rememberForever("Admin", function () { return []; });
        if (Auth::check()) {
            $userId = Auth::user()->id;
            $userName = Auth::user()->username;
            $carNr = Auth::user()->car_number;
            $name = Auth::user()->name;
        }
        if (Gate::allows('admin-page')) {
            return view('admin.index', [
                'admin' => json_encode($admin),
            ]);
        }
        if (Gate::allows('logged-in')) {
            $user = array("id" => $userId, "carNr" => $carNr, "name" => $name, "userName" => $userName);
            $physics_state = $this->getCarStateJSON($userName);
            if(is_array($physics_state)) {
                $physics_state = "{}";
            }
            $config = Cache::rememberForever("config".$userName, function () { return []; });
            return view('race.index', [
                'user' => json_encode($user),
                'state' => $physics_state,
                'admin' => json_encode($admin),
                'config' => json_encode($config)
            ]);
        } else {
            return redirect('/login');
        }
    }
}
