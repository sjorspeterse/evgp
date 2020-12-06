<?php

namespace App\Http\Controllers;

use App\Events\AdminUpdated;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
    // --------------- WEB -----------------

    public function index() {
        if (Gate::allows('admin-page')) {
            return view('admin.index');
        } else {
            return redirect('/');
        }
    }

    // --------------- API -----------------


    /**
     * Expects: 
     * {
     *      "breakdowns": "Enabled" / "Disabled", 
     * }
     */
    public function breakdowns(Request $request)
    {
        $breakdowns = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['breakdowns' => $breakdowns]);
        $admin = Cache::rememberForever( "admin", function () { return []; });

        $admin['breakdowns'] = $breakdowns;
        Cache::put('admin', $admin);

        return response($breakdowns, 201);
    }

    /**
     * Expects: 
     * {
     *      "forcepage": "landing" / "configuration" / "race", 
     * }
     */
    public function forcepage(Request $request)
    {
        $page = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['forcepage' => $page]);
        $admin = Cache::rememberForever( "admin", function () { return []; });

        $admin['forcepage'] = $page;
        Cache::put('admin', $admin);

        return response($page, 201);
    }

    /**
     * Expects: 
     * {
     *      "Total laps" / "Position"
     * }
     */
    public function reset(Request $request)
    {
        $reset = json_decode($request->getContent(), true);
        $all_users = User::all();
        foreach ($all_users as $user) {
            $key = $user->username;
            $physics_json = Cache::get($key);
            if(!$physics_json || is_array($physics_json)) {
                continue;
            }

            $physics = json_decode($physics_json);
            if ($reset === "Total laps") {
                $physics->totalLaps = 0;
                $physics->heatLaps = 0;
            }
            if ($reset === "Position") {
                $zero_npos =(object) ["lastPoint" => 0, "frac" => 0];
                $physics->npos = $zero_npos;
            }
            Cache::put($key, json_encode($physics));
        }
        AdminUpdated::dispatch(['reset' => $reset]);
        return response($reset, 201);
    }
}
