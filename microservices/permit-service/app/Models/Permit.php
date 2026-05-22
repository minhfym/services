<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    protected $fillable = [
        'user_id',
        'permit_number',
        'applicant_name',
        'applicant_id',
        'permit_type',
        'description',
        'location',
        'start_date',
        'expiry_date',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'fee_amount',
        'fee_paid',
    ];

    protected $casts = [
        'start_date' => 'date',
        'expiry_date' => 'date',
        'approved_at' => 'datetime',
        'fee_amount' => 'decimal:2',
        'fee_paid' => 'boolean',
    ];
}
