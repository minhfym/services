<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandRecord extends Model
{
    use HasFactory;

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

    protected function casts(): array
    {
        return [
            'area_sqm' => 'decimal:2',
            'current_value' => 'decimal:2',
            'registration_date' => 'date',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function transfers()
    {
        return $this->hasMany(LandTransfer::class);
    }
}
