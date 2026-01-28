<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function cart() {
        return $this->hasOne(Cart::class);
    }
    public function orders() {
        return $this->hasMany(Order::class);
    }
    public function isAdmin() {
        return $this->role === 'admin';
    }
}
