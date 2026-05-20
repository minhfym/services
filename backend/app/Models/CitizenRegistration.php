<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CitizenRegistration extends Model
{
    use HasFactory;

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
        'verified_by',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'verified_at' => 'datetime',
        ];
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
