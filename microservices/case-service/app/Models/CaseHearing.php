<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseHearing extends Model
{
    protected $fillable = [
        'law_case_id',
        'hearing_date',
        'hearing_time',
        'venue',
        'outcome',
        'next_hearing_date',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'hearing_date' => 'date',
        'next_hearing_date' => 'date',
    ];

    public function lawCase()
    {
        return $this->belongsTo(LawCase::class);
    }
}
