<?php

namespace App\Http\Controllers;

use App\Events\AdminUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
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
     *      "forcepage": "landing" / "configuration" / "race", 
     * }
     */
    public function reset(Request $request)
    {
        $reset = json_decode($request->getContent(), true);

        return response($reset, 201);
    }
}
