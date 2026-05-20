<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LawCase extends Model
{
    use HasFactory;

    protected $table = 'law_cases';

    protected $fillable = [
        'case_number',
        'title',
        'description',
        'case_type',
        'plaintiff_name',
        'plaintiff_id',
        'defendant_name',
        'defendant_id',
        'presiding_officer',
        'filing_date',
        'hearing_date',
        'verdict_date',
        'status',
        'verdict',
        'assigned_officer_id',
        'priority',
    ];

    protected function casts(): array
    {
        return [
            'filing_date' => 'date',
            'hearing_date' => 'date',
            'verdict_date' => 'date',
        ];
    }

    public function assignedOfficer()
    {
        return $this->belongsTo(User::class, 'assigned_officer_id');
    }

    public function hearings()
    {
        return $this->hasMany(CaseHearing::class, 'law_case_id');
    }
}
