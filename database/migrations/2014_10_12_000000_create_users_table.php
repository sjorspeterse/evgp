<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\User;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('password');
            $table->string('remember_token')->nullable();
            $table->timestamps();
        });

        DB::table('users')->insert([
            [
                'name' => 'Best High School on Earth',
                'username' => 'bestschool',
                'password' => Hash::make('wsTVcakF'),
            ],
            [
                'name' => 'Second Best High School on Earth',
                'username' => 'secondschool',
                'password' => Hash::make('rPueJBgZ'),
            ],

        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
