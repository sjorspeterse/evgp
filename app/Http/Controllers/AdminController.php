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
            $admin = Cache::rememberForever("Admin", function () { return []; });
            return view('admin.index', [
                'admin' => json_encode($admin),
            ]);
        } else {
            return redirect('/');
        }
    }

    // --------------- API -----------------

    /**
     * Expects: 
     * {
     *      "track": "Practice" / "Official", 
     * }
     */
    public function track(Request $request)
    {
        $track = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['track' => $track]);
        $admin = Cache::rememberForever( "Admin", function () { return []; });
        $admin['track'] = $track;
        Cache::put('Admin', $admin);

        return response($track, 201);
    }

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
        $admin = Cache::rememberForever("Admin", function () { return []; });

        $admin['breakdowns'] = $breakdowns;
        Cache::put('Admin', $admin);

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
        $admin = Cache::rememberForever("Admin", function () { return []; });

        $admin['forcepage'] = $page;
        Cache::put('Admin', $admin);

        return response($page, 201);
    }

    /**
     * Expects: 
     * {
     *      "Total laps" / "Position / "Lineup"
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
                $physics->spd = 0;
            }
            Cache::put($key, json_encode($physics));
        }
        AdminUpdated::dispatch(['reset' => $reset]);
        return response($reset, 201);
    }

    /**
     * Expects: 
     * {
     *      "Practice" / "Head" / "Break"
     * }
     */
    public function mode(Request $request)
    {
        $mode = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['mode' => $mode]);
        $admin = Cache::rememberForever("Admin", function () { return []; });

        $admin['mode'] = $mode;
        Cache::put('Admin', $admin);
        return response($mode, 201);
    }

    /**
     * Expects: 
     * {
     *      "Green" / "Yellow" 
     * }
     */
    public function topflag(Request $request)
    {
        $topflag = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['topflag' => $topflag]);
        $admin = Cache::rememberForever("Admin", function () { return []; });

        $admin['topflag'] = $topflag;
        Cache::put('Admin', $admin);
        return response($topflag, 201);
    }

    /**
     * Expects: 
     * {
     *      "Gone" / "Blue" / "White"
     * }
     */
    public function centerflag(Request $request)
    {
        $centerflag = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['centerflag' => $centerflag]);
        $admin = Cache::rememberForever("Admin", function () { return []; });

        $admin['centerflag'] = $centerflag;
        Cache::put('Admin', $admin);
        return response($centerflag, 201);
    }

    /**
     * Expects: 
     * {
     *      'Total laps' / 'Fastest lap'
     * }
     */
    public function sort(Request $request)
    {
        $sort = json_decode($request->getContent(), true);
        AdminUpdated::dispatch(['sort' => $sort]);
        $admin = Cache::rememberForever("Admin", function () { return []; });

        $admin['sort'] = $sort;
        Cache::put('Admin', $admin);
        return response($sort, 201);
    }
}
