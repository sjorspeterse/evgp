<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use App\Models\Penalty;
use App\User;
use App\Events\PenaltyEvent;

class PenaltyController extends Controller
{
    /**
     * Expects: 
     * {
     *      "car_nr": "007", 
     *      "reason": "I don't like you!", 
     *      "penalty_value": 5, 
     *      "penalty_type": "SEC"      or  "LAP"
     * }
     */
    public function store(Request $request)
    {
        $json = json_decode($request->getContent(), true);
        $car_nr = $json['car_nr'];
        $user = User::where('car_number', $car_nr)->firstOrFail();
        $json['user_id'] = $user->id;
        $penalty = Penalty::create($json);
        PenaltyEvent::dispatch($penalty, $car_nr);
        return response($user, 201);
    }
}
