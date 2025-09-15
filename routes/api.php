<?php

use App\Http\Controllers\MenuController;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user',function(Request $request){
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/test", function(){
    return ["name"=>"norman","surname"=>"osborn"];
});

Route::get('/menus',[MenuController::class,'getall']);