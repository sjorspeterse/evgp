<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCarNrToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('car_number')->nullable();
        });

        DB::table('users')
              ->where('username', 'bestschool')
              ->update(['car_number' => "1001"]);
        DB::table('users')
              ->where('username', 'secondschool')
              ->update(['car_number' => "1002"]);
        DB::table('users')
              ->where('username', 'thirdschool')
              ->update(['car_number' => "1003"]);
        DB::table('users')
              ->where('username', 'admin')
              ->update(['car_number' => "1000"]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('car_number');
        });
    }
}
