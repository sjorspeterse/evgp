<?php

use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CarPhysicsController;
use App\Http\Controllers\PenaltyController;
use App\Http\Controllers\CarConfigController;
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
Route::get('car-state/{username}', [CarPhysicsController::class, 'getCarStateJSON']);

Route::post('penalty', [PenaltyController::class, 'store']);
Route::post('track', [AdminController::class, 'track']);
Route::post('breakdowns', [AdminController::class, 'breakdowns']);
Route::post('forcepage', [AdminController::class, 'forcepage']);
Route::post('reset', [AdminController::class, 'reset']);
Route::post('mode', [AdminController::class, 'mode']);
Route::post('topflag', [AdminController::class, 'topflag']);
Route::post('centerflag', [AdminController::class, 'centerflag']);
Route::post('sort', [AdminController::class, 'sort']);
Route::post('car-config/{username}', [CarConfigController::class, 'store']);
