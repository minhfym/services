<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'national_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function taxRecords()
    {
        return $this->hasMany(TaxRecord::class);
    }

    public function permits()
    {
        return $this->hasMany(Permit::class);
    }

    public function landRecords()
    {
        return $this->hasMany(LandRecord::class, 'owner_id');
    }

    public function grantApplications()
    {
        return $this->hasMany(GrantApplication::class, 'applicant_id');
    }

    public function createdGrants()
    {
        return $this->hasMany(Grant::class, 'created_by');
    }

    public function assignedCases()
    {
        return $this->hasMany(LawCase::class, 'assigned_officer_id');
    }
}
