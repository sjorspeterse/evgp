<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\CountingJob;
use App\Models\CarPhysics;
use App\Models\AppState;
use App\Events\CarsUpdated;
use App\Events\AppStateUpdated;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Throwable;

class CarPhysicsController extends Controller
{
    const car_physics_cache = 'car_physics';
    const car_physics_invalidation_time = 10;
    const app_state_cache = 'app_state';
    const app_state_invalidation_time = 10;

    public function loop() {
        $appState = $this->getAppState();
        $carPhysics = $this->getCarPhysics();
        Log::debug("Before loop");
        while($appState->running) {
            $carPhysics->counter++;
            broadcast(new CarsUpdated($carPhysics));
            $this->storeCarPhysicsToCache($carPhysics);
            if($carPhysics->counter % 20 == 0) {
                $this->storeToDataBase($carPhysics);
                $userList = $this->getUserList();
                Log::debug("FROM CARPHYSISCONTROLLER: User list: " . $userList);
            }
            $appState = $this->getAppState();
            usleep(50000);
        }
        Log::debug("After loop");
    }

    private function getAppState() {
        return Cache::remember(
            self::app_state_cache, self::app_state_invalidation_time, function () {
                return $this->getAppStateFromDB();
            }
        );
    }

    private function getUserList() {
        return Cache::get( "user_list");
    }

    private function getAppStateFromDB() {
        return $this->safeCall(function(){
            $state = AppState::latest()->first();
            $state->running = (boolean) $state->running;
            return $state;
        });
    }

    public function getCarPhysics()
    {
        return Cache::remember(
            self::car_physics_cache, self::car_physics_invalidation_time, function () {
                return $this->getCarPhysicsFromDB();
            }
        );
    }

    public function getCarPhysicsFromDB() {
        return $this->safeCall(function(){
            $carPhysics = CarPhysics::latest()->first();
            $carPhysics->counter = (int) $carPhysics->counter;
            return $carPhysics;
        });
    }

    public function storeToDataBase(Model $model) {
        $newModel = $model->replicate();
        $this->safeCall(function() use ($newModel) {
            $newModel->save();
        });
    }

    public function storeAppStateToCache(AppState $state) {
        Cache::put(self::app_state_cache, $state, self::app_state_invalidation_time);
    }

    public function storeCarPhysicsToCache(CarPhysics $car_physics) {
        Cache::put(self::car_physics_cache, $car_physics, self::car_physics_invalidation_time);
    }

    private function safeCall($codeToCall, $error_return=-1) {
        $return_value = null;
        try {
            $return_value = $codeToCall();
        } catch (QueryException $e) {
            Log::warning("whoopsie! Got error: ");
            Log::warning($e->getMessage());
            $return_value=$error_return;
        }
        return $return_value;
    }

    // --------------------API-------------------- \\
   
    public function startCounter()
    {
        Log::debug("Starting counter... Getting app state...");
        $state = $this->getAppState();
        if($state->running) {
            Log::debug("Was already running! Exiting");
            return;
        }

        Log::debug("Setting running to true");
        $state->running = true;
        Log::debug("Storing app state to cache...");
        $this->storeAppStateToCache($state);
        Log::debug("Store app state to database...");
        $this->storeToDataBase($state);

        Log::debug("Dispatching counting job...");
        CountingJob::dispatch();
        Log::debug("Broadcasting updated appstate...");
        broadcast(new AppStateUpdated($state));
        Log::debug("Done starting counter!");
    }

    public function stopCounter() 
    {
        Log::debug("Stopping counter... Getting app state...");
        $state = $this->getAppState();
        Log::debug("Setting running to false...");
        $state->running = false;
        Log::debug("storing app state to cache...");
        $this->storeAppStateToCache($state);
        Log::debug("storing app state to database...");
        $this->storeToDataBase($state);
        Log::debug("Broadcasting new state...");
        broadcast(new AppStateUpdated($state));
        Log::debug("Done stopping counter");
    }

    public function getAppStateJSON()
    {
        $start = now();
        $state = $this->getAppState();
        $car_physics = $this->getCarPhysics();
        $end = now();
        $state_array = [
            'counter' => $car_physics->counter,
            'running' => $state->running,
            'processTime' => $end->diffInMilliSeconds($start)
        ];

        return response()->json($state_array, 200);
    }
}
