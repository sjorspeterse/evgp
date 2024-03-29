<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\CarPhysics;

class CreateCarPhysicsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('car_physics', function (Blueprint $table) {
            $table->id();
            $table->integer('counter');
            $table->timestamps();

            $table->integer('user_id')->index();
        });

        $physics = new CarPhysics();
        $physics->counter = 0;
        $physics->user_id = 3;
        $physics->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('car_physics');
    }
}
