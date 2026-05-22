<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrantApplication extends Model
{
    protected $fillable = [
        'grant_id',
        'applicant_id',
        'application_number',
        'purpose',
        'amount_requested',
        'amount_approved',
        'supporting_documents',
        'status',
        'review_notes',
        'reviewed_by',
        'reviewed_at',
        'disbursed_at',
    ];

    protected $casts = [
        'supporting_documents' => 'array',
        'reviewed_at' => 'datetime',
        'disbursed_at' => 'datetime',
        'amount_requested' => 'decimal:2',
        'amount_approved' => 'decimal:2',
    ];

    public function grant()
    {
        return $this->belongsTo(Grant::class);
    }
}
