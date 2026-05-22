<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandRecord extends Model
{
    protected $fillable = [
        'owner_id',
        'plot_number',
        'location',
        'district',
        'region',
        'area_sqm',
        'land_use',
        'title_deed_number',
        'registration_date',
        'current_value',
        'status',
        'encumbrances',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'area_sqm' => 'decimal:2',
        'current_value' => 'decimal:2',
    ];

    public function transfers()
    {
        return $this->hasMany(LandTransfer::class);
    }
}
