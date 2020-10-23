<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/public', [App\Http\Controllers\PublicController::class, 'index']);
// Route::get('/race', [App\Http\Controllers\RaceController::class, 'index']);
// Route::get('/test-latency', [App\Http\Controllers\TestController::class, 'index']);
// Route::get('/team/{team}', [App\Http\Controllers\TeamController::class, 'index']);
// Route::get('/admin', [App\Http\Controllers\AdminController::class, 'index']);
