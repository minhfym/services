<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'land_record_id',
        'from_owner_id',
        'to_owner_id',
        'transfer_date',
        'transfer_value',
        'reason',
        'status',
        'processed_by',
    ];

    protected function casts(): array
    {
        return [
            'transfer_date' => 'date',
            'transfer_value' => 'decimal:2',
        ];
    }

    public function landRecord()
    {
        return $this->belongsTo(LandRecord::class);
    }

    public function fromOwner()
    {
        return $this->belongsTo(User::class, 'from_owner_id');
    }

    public function toOwner()
    {
        return $this->belongsTo(User::class, 'to_owner_id');
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
