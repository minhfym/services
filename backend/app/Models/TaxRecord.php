<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tax_number',
        'taxpayer_name',
        'taxpayer_id',
        'tax_type',
        'amount_due',
        'amount_paid',
        'due_date',
        'payment_date',
        'status',
        'financial_year',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount_due' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'due_date' => 'date',
            'payment_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
