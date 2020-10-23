<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\AppState;

class CreateAppStatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_states', function (Blueprint $table) {
            $table->id();
            $table->boolean('running');
            $table->timestamps();
        });

        $init = new AppState();
        $init->running = false;
        $init->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('app_states');
    }
}
