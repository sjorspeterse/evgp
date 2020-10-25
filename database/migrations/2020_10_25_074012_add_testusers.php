<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class AddTestusers extends Migration
{
    private $nrOfUsers = 20;

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        for ($i = 1; $i <= $this->nrOfUsers; $i++) {
            $user = new User();
            $user->name = 'High School ' . $i;
            $user->username = 'user' . $i;
            $user->password = Hash::make('user' . $i);
            $user->car_number = "10" . sprintf('%02d', $i);
            $user->save();

            // DB::table('users')->insert([
                // [
            //         'name' => 'High School ' . $i,
            //         'username' => 'user' . $i,
            //         'password' => Hash::make('user' . $i),
            //         'car_number' => "10" . sprintf('%02d', $i),
            //     ],
            // ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        for ($i = 1; $i <= $this->nrOfUsers; $i++) {
            DB::table('users')->where('username', '=', 'user' . $i)->delete();
        }
    }
}
