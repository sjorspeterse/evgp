@extends('layouts.app')

@section('content')
<div id="race_container" user='{{ $user }}' state='{{ $state }}' admin='{{ $admin }}' config='{{ $config }}'></div>
@endsection