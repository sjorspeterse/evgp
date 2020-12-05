@extends('layouts.app')

@section('content')
<div id="race_container" user='{{ $user }}' state='{{ $state }}' track='{{ $track }}'></div>
@endsection