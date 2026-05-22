<?php

namespace Database\Seeders;

use App\Models\Permit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $permits = [
            [
                'user_id' => 1,
                'permit_number' => 'PERM-2024-0001',
                'applicant_name' => 'John Citizen',
                'applicant_id' => 'NID-001-2024',
                'permit_type' => 'building',
                'description' => 'Construction of a 3-bedroom residential house on Plot 45, Greenview Estate',
                'location' => 'Plot 45, Greenview Estate, Central District',
                'start_date' => '2024-03-01',
                'expiry_date' => '2025-03-01',
                'status' => 'approved',
                'approved_by' => 2,
                'approved_at' => '2024-02-15 10:00:00',
                'fee_amount' => 1500.00,
                'fee_paid' => true,
            ],
            [
                'user_id' => 3,
                'permit_number' => 'PERM-2024-0002',
                'applicant_name' => 'ABC Business Ltd',
                'applicant_id' => 'BUS-002-2024',
                'permit_type' => 'business',
                'description' => 'License to operate a retail shop selling electronics and accessories',
                'location' => '12 Commerce Street, Business District',
                'start_date' => null,
                'expiry_date' => null,
                'status' => 'under_review',
                'approved_by' => null,
                'approved_at' => null,
                'fee_amount' => 500.00,
                'fee_paid' => false,
            ],
            [
                'user_id' => 4,
                'permit_number' => 'PERM-2024-0003',
                'applicant_name' => 'Green Energy Co',
                'applicant_id' => 'BUS-003-2024',
                'permit_type' => 'environmental',
                'description' => 'Environmental clearance for solar panel installation on 10 hectares of land',
                'location' => 'Rural Zone 7, Northern Region',
                'start_date' => '2024-06-01',
                'expiry_date' => '2029-06-01',
                'status' => 'approved',
                'approved_by' => 2,
                'approved_at' => '2024-05-10 14:30:00',
                'fee_amount' => 3000.00,
                'fee_paid' => true,
            ],
            [
                'user_id' => 5,
                'permit_number' => 'PERM-2024-0004',
                'applicant_name' => 'City Restaurant',
                'applicant_id' => 'BUS-004-2024',
                'permit_type' => 'health',
                'description' => 'Health and safety permit for food service establishment with 50-seat capacity',
                'location' => '88 Food Court, City Center',
                'start_date' => null,
                'expiry_date' => null,
                'status' => 'rejected',
                'rejection_reason' => 'Kitchen facilities do not meet minimum health and safety standards. Please reapply after renovations.',
                'approved_by' => null,
                'approved_at' => null,
                'fee_amount' => 750.00,
                'fee_paid' => true,
            ],
            [
                'user_id' => 2,
                'permit_number' => 'PERM-2024-0005',
                'applicant_name' => 'Harbor Imports',
                'applicant_id' => 'BUS-005-2024',
                'permit_type' => 'trade',
                'description' => 'Import/export trade license for agricultural goods and commodities',
                'location' => 'Port Area, Industrial Zone',
                'start_date' => null,
                'expiry_date' => null,
                'status' => 'submitted',
                'approved_by' => null,
                'approved_at' => null,
                'fee_amount' => 2500.00,
                'fee_paid' => false,
            ],
        ];

        foreach ($permits as $permit) {
            Permit::create($permit);
        }
    }
}
