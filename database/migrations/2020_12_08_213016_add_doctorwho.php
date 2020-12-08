<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AddDoctorwho extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $user1 = new User();
        $user1->name = 'School Without Walls';
        $user1->username = 'DoctorWho';
        $user1->password = Hash::make('WEincemE');
        $user1->car_number = '42';
        $user1->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('users')->where('username', '=', 'DoctorWho')->delete();
    }
}
