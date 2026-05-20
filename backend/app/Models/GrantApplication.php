<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrantApplication extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'amount_requested' => 'decimal:2',
            'amount_approved' => 'decimal:2',
            'supporting_documents' => 'array',
            'reviewed_at' => 'datetime',
            'disbursed_at' => 'datetime',
        ];
    }

    public function grant()
    {
        return $this->belongsTo(Grant::class);
    }

    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
