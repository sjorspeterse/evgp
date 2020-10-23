<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CarPhysicsController;
use App\Http\Controllers\PenaltyController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('start-counter', [CarPhysicsController::class, 'startCounter']);
Route::get('stop-counter', [CarPhysicsController::class, 'stopCounter']);
Route::get('state', [CarPhysicsController::class, 'getAppStateJSON']);

Route::post('penalty', [PenaltyController::class, 'store']);
