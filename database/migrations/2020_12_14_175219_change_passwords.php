<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ChangePasswords extends Migration
{
    private function change($username, $password) {
        $user = User::where('username', $username)->first();
        $user->password = Hash::make($password);
        $user->save();
    }
    
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->change('Banneker01', 'EINgEnTR');
        $this->change('cardozoengineers2020', 'OulrYmeN');
        $this->change('TPEVClub', 'iFLUgHte');
        $this->change('mthsEV', 'BLePROne');
        $this->change('PhelpsPanthers704', 'OMbraNar');
        $this->change('WilsonEV', 'XeCatedG');
        $this->change('Woodsonwarriors', 'mbEFlous');
        $this->change('DoctorWho', 'couRsfil');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $this->change('Banneker01', 'EweRYsTR');
        $this->change('cardozoengineers2020', 'pReCtAId');
        $this->change('TPEVClub', 'turEkinA');
        $this->change('mthsEV', 'eVeRlIVe');
        $this->change('PhelpsPanthers704', 'ERphotLa');
        $this->change('WilsonEV', 'TIngenZa');
        $this->change('Woodsonwarriors', 'oDsmERap');
        $this->change('DoctorWho', 'WEincemE');
    }
}
