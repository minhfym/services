<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grant extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'grant_type',
        'total_budget',
        'available_budget',
        'max_per_applicant',
        'eligibility_criteria',
        'application_deadline',
        'disbursement_date',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'total_budget' => 'decimal:2',
            'available_budget' => 'decimal:2',
            'max_per_applicant' => 'decimal:2',
            'application_deadline' => 'date',
            'disbursement_date' => 'date',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function applications()
    {
        return $this->hasMany(GrantApplication::class);
    }
}
