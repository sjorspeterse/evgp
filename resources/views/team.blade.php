@extends('layouts.app')

@section('content')
    <div class="text-white">
        <h1>{{$team->name}}</h1>
        <h2>Canopy</h2>
        {{--<p>{{$team->carSettings->canopy}}</p>--}}
        <h2>Ballast</h2>
        {{-- <p>{{$team->carSettings->ballast}}</p> --}}
    </div>
@endsection
