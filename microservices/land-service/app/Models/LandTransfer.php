<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandTransfer extends Model
{
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

    protected $casts = [
        'transfer_date' => 'date',
        'transfer_value' => 'decimal:2',
    ];

    public function landRecord()
    {
        return $this->belongsTo(LandRecord::class);
    }
}
