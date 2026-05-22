<?php

namespace Database\Seeders;

use App\Models\Grant;
use App\Models\GrantApplication;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $grants = [
            [
                'title' => 'Youth Education Support Fund 2024',
                'description' => 'Financial support for students from low-income households pursuing tertiary education',
                'grant_type' => 'education',
                'total_budget' => 500000.00,
                'available_budget' => 350000.00,
                'max_per_applicant' => 15000.00,
                'eligibility_criteria' => 'Age 18-30, household income below $20,000 per year, enrolled in accredited institution',
                'application_deadline' => '2024-12-31',
                'disbursement_date' => '2025-02-01',
                'status' => 'open',
                'created_by' => 1,
            ],
            [
                'title' => 'Small Business Recovery Grant',
                'description' => 'Grants to help small businesses recover and grow post-economic disruption',
                'grant_type' => 'business',
                'total_budget' => 1000000.00,
                'available_budget' => 750000.00,
                'max_per_applicant' => 50000.00,
                'eligibility_criteria' => 'Registered business, fewer than 50 employees, minimum 2 years operation',
                'application_deadline' => '2024-11-30',
                'disbursement_date' => null,
                'status' => 'open',
                'created_by' => 1,
            ],
            [
                'title' => 'Agricultural Modernization Grant',
                'description' => 'Support for farmers to adopt modern farming technologies and practices',
                'grant_type' => 'agriculture',
                'total_budget' => 750000.00,
                'available_budget' => 600000.00,
                'max_per_applicant' => 25000.00,
                'eligibility_criteria' => 'Registered farmer, land ownership or long-term lease, minimum 5 acres',
                'application_deadline' => '2024-10-31',
                'disbursement_date' => '2024-12-15',
                'status' => 'open',
                'created_by' => 2,
            ],
        ];

        foreach ($grants as $grant) {
            Grant::create($grant);
        }

        $applications = [
            [
                'grant_id' => 1,
                'applicant_id' => 3,
                'application_number' => 'APP-2024-0001',
                'purpose' => 'Tuition fees and accommodation for Bachelor of Computer Science degree',
                'amount_requested' => 12000.00,
                'amount_approved' => 12000.00,
                'supporting_documents' => ['admission_letter.pdf', 'income_proof.pdf'],
                'status' => 'approved',
                'review_notes' => 'All criteria met, strong academic record',
                'reviewed_by' => 2,
                'reviewed_at' => '2024-06-15 10:00:00',
                'disbursed_at' => null,
            ],
            [
                'grant_id' => 1,
                'applicant_id' => 4,
                'application_number' => 'APP-2024-0002',
                'purpose' => 'Nursing degree full scholarship support including books and supplies',
                'amount_requested' => 15000.00,
                'amount_approved' => 15000.00,
                'supporting_documents' => ['university_offer.pdf', 'family_income_cert.pdf'],
                'status' => 'disbursed',
                'review_notes' => 'Maximum grant approved - critical healthcare field',
                'reviewed_by' => 2,
                'reviewed_at' => '2024-05-20 14:00:00',
                'disbursed_at' => '2024-06-01 09:00:00',
            ],
            [
                'grant_id' => 2,
                'applicant_id' => 5,
                'application_number' => 'APP-2024-0003',
                'purpose' => 'Purchase new equipment and expand retail space for hardware store',
                'amount_requested' => 45000.00,
                'amount_approved' => null,
                'supporting_documents' => ['business_reg.pdf', 'financial_statements.pdf', 'business_plan.pdf'],
                'status' => 'under_review',
                'review_notes' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
                'disbursed_at' => null,
            ],
            [
                'grant_id' => 3,
                'applicant_id' => 6,
                'application_number' => 'APP-2024-0004',
                'purpose' => 'Purchase irrigation system and modern planting equipment for 20-acre farm',
                'amount_requested' => 20000.00,
                'amount_approved' => null,
                'supporting_documents' => ['land_title.pdf', 'farm_photos.pdf'],
                'status' => 'submitted',
                'review_notes' => null,
                'reviewed_by' => null,
                'reviewed_at' => null,
                'disbursed_at' => null,
            ],
            [
                'grant_id' => 2,
                'applicant_id' => 7,
                'application_number' => 'APP-2024-0005',
                'purpose' => 'Restaurant kitchen renovation and staff training program',
                'amount_requested' => 30000.00,
                'amount_approved' => null,
                'supporting_documents' => ['business_reg.pdf', 'renovation_quotes.pdf'],
                'status' => 'rejected',
                'review_notes' => 'Business registered less than 2 years - does not meet minimum operation requirement',
                'reviewed_by' => 2,
                'reviewed_at' => '2024-07-10 11:00:00',
                'disbursed_at' => null,
            ],
        ];

        foreach ($applications as $app) {
            GrantApplication::create($app);
        }
    }
}
