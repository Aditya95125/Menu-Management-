<?php

use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->controller(MenuController::class)->group(function () {
    Route::get('/all', 'index')->name('all-menu');
    Route::get('/create', 'create')->name('create-menu');
    Route::post('/', 'save')->name('save-menu');
    Route::get('/menus/{menu}/edit', 'edit')->name('edit-menu');
    Route::put('/menus/{menu}', 'update')->name('update-menu');
    Route::post('/menus/{menu}/move', 'move')->name('menus-move');
    Route::post('/menus/reorder', 'reorder')->name('menus-reorder');
    Route::delete('/menus/{menu}', 'destroy')->name('delete-menu');
    Route::get('/menus/all', 'showAll')->name('all-menu');

});


// Route::get('/abc',function(){
//   return Inertia::render('create');
// });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
