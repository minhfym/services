<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LawCase extends Model
{
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

    protected $casts = [
        'filing_date' => 'date',
        'hearing_date' => 'date',
        'verdict_date' => 'date',
    ];

    public function hearings()
    {
        return $this->hasMany(CaseHearing::class);
    }
}
