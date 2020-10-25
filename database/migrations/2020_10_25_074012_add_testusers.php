<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTestusers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('users')->insert([
            [
                'name' => 'Best High School on Earth',
                'username' => 'user1',
                'password' => Hash::make('user1'),
            ],
            [
                'name' => 'Second Best High School on Earth',
                'username' => 'user2',
                'password' => Hash::make('user2'),
            ],
            [
                'name' => 'Third Best High School on Earth',
                'username' => 'user3',
                'password' => Hash::make('user3'),
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
        DB::table('users')->where('username', '=', 'user1')->delete();
        DB::table('users')->where('username', '=', 'user2')->delete();
        DB::table('users')->where('username', '=', 'user3')->delete();
    }
}
