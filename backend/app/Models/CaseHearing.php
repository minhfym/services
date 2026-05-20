<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseHearing extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'hearing_date' => 'date',
            'next_hearing_date' => 'date',
        ];
    }

    public function lawCase()
    {
        return $this->belongsTo(LawCase::class, 'law_case_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
