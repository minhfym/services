<?php

namespace Database\Seeders;

use App\Models\LandRecord;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $lands = [
            [
                'owner_id' => 1,
                'plot_number' => 'PLT-001-2024',
                'location' => '15 Hillside Avenue, Greenwood',
                'district' => 'Central District',
                'region' => 'Northern Region',
                'area_sqm' => 450.00,
                'land_use' => 'residential',
                'title_deed_number' => 'TD-NR-001-2024',
                'registration_date' => '2020-05-15',
                'current_value' => 125000.00,
                'status' => 'registered',
                'encumbrances' => null,
            ],
            [
                'owner_id' => 2,
                'plot_number' => 'PLT-002-2024',
                'location' => '88 Commerce Boulevard, Business Park',
                'district' => 'East District',
                'region' => 'Eastern Region',
                'area_sqm' => 2500.00,
                'land_use' => 'commercial',
                'title_deed_number' => 'TD-ER-002-2024',
                'registration_date' => '2018-11-20',
                'current_value' => 850000.00,
                'status' => 'mortgaged',
                'encumbrances' => 'Bank mortgage - First National Bank - expires 2030',
            ],
            [
                'owner_id' => 3,
                'plot_number' => 'PLT-003-2024',
                'location' => 'Farm Road 7, Rural Valley',
                'district' => 'South District',
                'region' => 'Southern Region',
                'area_sqm' => 50000.00,
                'land_use' => 'agricultural',
                'title_deed_number' => 'TD-SR-003-2024',
                'registration_date' => '2015-03-10',
                'current_value' => 320000.00,
                'status' => 'under_transfer',
                'encumbrances' => null,
            ],
            [
                'owner_id' => 4,
                'plot_number' => 'PLT-004-2024',
                'location' => 'Industrial Area Zone 3',
                'district' => 'West District',
                'region' => 'Western Region',
                'area_sqm' => 10000.00,
                'land_use' => 'industrial',
                'title_deed_number' => 'TD-WR-004-2024',
                'registration_date' => '2019-07-22',
                'current_value' => 1200000.00,
                'status' => 'disputed',
                'encumbrances' => 'Boundary dispute with Plot PLT-005-2024 - Court case #CC-2024-101',
            ],
            [
                'owner_id' => 5,
                'plot_number' => 'PLT-005-2024',
                'location' => 'Park Lane, City Center',
                'district' => 'Central District',
                'region' => 'Central Region',
                'area_sqm' => 800.00,
                'land_use' => 'public',
                'title_deed_number' => 'TD-CR-005-2024',
                'registration_date' => '2010-01-01',
                'current_value' => 500000.00,
                'status' => 'registered',
                'encumbrances' => null,
            ],
        ];

        foreach ($lands as $land) {
            LandRecord::create($land);
        }
    }
}
