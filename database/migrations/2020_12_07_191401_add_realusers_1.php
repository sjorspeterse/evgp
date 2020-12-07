<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AddRealusers1 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            $user1 = new User();
            $user1->name = 'Benjamin Banneker Academic High School';
            $user1->username = 'Banneker01';
            $user1->password = Hash::make('EweRYsTR');
            $user1->car_number = '01';
            $user1->save();

            $user2 = new User();
            $user2->name = 'Francis L. Cardozo Education Campus';
            $user2->username = 'cardozoengineers2020';
            $user2->password = Hash::make('pReCtAId');
            $user2->car_number = '12';
            $user2->save();

            $user3 = new User();
            $user3->name = 'Friendship Tech Prep Academy';
            $user3->username = 'TPEVClub';
            $user3->password = Hash::make('turEkinA');
            $user3->car_number = '62';
            $user3->save();

            $user4 = new User();
            $user4->name = 'McKinley Technology High School';
            $user4->username = 'mthsEV';
            $user4->password = Hash::make('eVeRlIVe');
            $user4->car_number = '99';
            $user4->save();

            $user5 = new User();
            $user5->name = 'Phelps ACE High School';
            $user5->username = 'PhelpsPanthers704';
            $user5->password = Hash::make('ERphotLa');
            $user5->car_number = '04';
            $user5->save();

            $user6 = new User();
            $user6->name = 'Wilson High School';
            $user6->username = 'WilsonEV';
            $user6->password = Hash::make('TIngenZa');
            $user6->car_number = '14';
            $user6->save();

            $user7 = new User();
            $user7->name = 'H.D. Woodson STEM High School';
            $user7->username = 'Woodsonwarriors';
            $user7->password = Hash::make('oDsmERap');
            $user7->car_number = '55';
            $user7->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('users')->where('username', '=', 'Banneker01')->delete();
        DB::table('users')->where('username', '=', 'cardozoengineers2020')->delete();
        DB::table('users')->where('username', '=', 'TPEVClub')->delete();
        DB::table('users')->where('username', '=', 'mthsEV')->delete();
        DB::table('users')->where('username', '=', 'PhelpsPanthers704')->delete();
        DB::table('users')->where('username', '=', 'WilsonEV')->delete();
        DB::table('users')->where('username', '=', 'Woodsonwarriors')->delete();
    }
}
