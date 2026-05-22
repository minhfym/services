<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CitizenRegistration extends Model
{
    protected $fillable = [
        'registration_number',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender',
        'national_id',
        'passport_number',
        'nationality',
        'marital_status',
        'address',
        'city',
        'region',
        'phone',
        'email',
        'emergency_contact_name',
        'emergency_contact_phone',
        'registration_type',
        'status',
        'user_id',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'verified_at' => 'datetime',
    ];
}
