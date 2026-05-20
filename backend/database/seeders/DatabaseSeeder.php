<?php

namespace Database\Seeders;

use App\Models\CitizenRegistration;
use App\Models\Grant;
use App\Models\GrantApplication;
use App\Models\LandRecord;
use App\Models\LawCase;
use App\Models\Permit;
use App\Models\TaxRecord;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create core users
        $admin = User::create([
            'name'       => 'Admin User',
            'email'      => 'admin@gov.portal',
            'password'   => Hash::make('password'),
            'role'       => 'admin',
            'phone'      => '+1-555-0100',
            'address'    => '1 Government Plaza, Capital City',
            'national_id'=> 'ADMIN-001',
            'is_active'  => true,
        ]);

        $officer = User::create([
            'name'       => 'Officer Jane Doe',
            'email'      => 'officer@gov.portal',
            'password'   => Hash::make('password'),
            'role'       => 'officer',
            'phone'      => '+1-555-0200',
            'address'    => '2 Government Ave, Capital City',
            'national_id'=> 'OFFICER-001',
            'is_active'  => true,
        ]);

        $citizen = User::create([
            'name'       => 'John Citizen',
            'email'      => 'citizen@gov.portal',
            'password'   => Hash::make('password'),
            'role'       => 'citizen',
            'phone'      => '+1-555-0300',
            'address'    => '42 Main Street, Springfield',
            'national_id'=> 'NID-123456',
            'is_active'  => true,
        ]);

        // Extra citizens for FK references
        $citizen2 = User::create([
            'name'        => 'Mary Smith',
            'email'       => 'mary.smith@example.com',
            'password'    => Hash::make('password'),
            'role'        => 'citizen',
            'phone'       => '+1-555-0301',
            'address'     => '10 Oak Road, Shelbyville',
            'national_id' => 'NID-654321',
            'is_active'   => true,
        ]);

        // ─── Tax Records (10) ───────────────────────────────────────────────
        $taxTypes     = ['income', 'property', 'business', 'vat', 'customs'];
        $taxStatuses  = ['pending', 'paid', 'overdue', 'partial'];
        $taxpayers    = [$citizen, $citizen2, $officer, $admin];

        for ($i = 1; $i <= 10; $i++) {
            $taxpayer  = $taxpayers[($i - 1) % count($taxpayers)];
            $amountDue = round(mt_rand(500, 50000) / 100, 2) * 100;
            $status    = $taxStatuses[($i - 1) % count($taxStatuses)];
            $amountPaid = match ($status) {
                'paid'    => $amountDue,
                'partial' => round($amountDue * 0.5, 2),
                default   => 0,
            };

            TaxRecord::create([
                'user_id'        => $taxpayer->id,
                'tax_number'     => 'TAX-' . strtoupper(Str::random(8)),
                'taxpayer_name'  => $taxpayer->name,
                'taxpayer_id'    => $taxpayer->national_id ?? 'NID-' . $i,
                'tax_type'       => $taxTypes[($i - 1) % count($taxTypes)],
                'amount_due'     => $amountDue,
                'amount_paid'    => $amountPaid,
                'due_date'       => now()->addDays(mt_rand(-30, 90))->toDateString(),
                'payment_date'   => in_array($status, ['paid', 'partial']) ? now()->subDays(mt_rand(1, 20))->toDateString() : null,
                'status'         => $status,
                'financial_year' => '2025-2026',
                'notes'          => "Auto-generated tax record #{$i}",
            ]);
        }

        // ─── Permits (5) ────────────────────────────────────────────────────
        $permitTypes    = ['building', 'business', 'environmental', 'health', 'trade'];
        $permitStatuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];

        for ($i = 1; $i <= 5; $i++) {
            $applicant = $taxpayers[($i - 1) % count($taxpayers)];
            $status    = $permitStatuses[$i - 1];

            Permit::create([
                'user_id'          => $applicant->id,
                'permit_number'    => 'PRM-' . strtoupper(Str::random(8)),
                'applicant_name'   => $applicant->name,
                'applicant_id'     => $applicant->national_id ?? 'NID-' . $i,
                'permit_type'      => $permitTypes[$i - 1],
                'description'      => "Permit application #{$i} for {$permitTypes[$i - 1]} purposes.",
                'location'         => "{$i}00 Business District, Capital City",
                'start_date'       => $status === 'approved' ? now()->toDateString() : null,
                'expiry_date'      => $status === 'approved' ? now()->addYear()->toDateString() : null,
                'status'           => $status,
                'rejection_reason' => $status === 'rejected' ? 'Incomplete documentation submitted.' : null,
                'approved_by'      => $status === 'approved' ? $officer->id : null,
                'approved_at'      => $status === 'approved' ? now() : null,
                'fee_amount'       => mt_rand(100, 2000),
                'fee_paid'         => $status === 'approved',
            ]);
        }

        // ─── Land Records (5) ───────────────────────────────────────────────
        $landUses     = ['residential', 'commercial', 'agricultural', 'industrial', 'public'];
        $landStatuses = ['registered', 'under_transfer', 'disputed', 'mortgaged', 'registered'];
        $districts    = ['Central', 'Northern', 'Southern', 'Eastern', 'Western'];
        $regions      = ['Metro', 'Highland', 'Coastal', 'Valley', 'Plains'];

        $landOwners = [$citizen, $citizen2, $admin, $officer, $citizen];
        for ($i = 1; $i <= 5; $i++) {
            LandRecord::create([
                'owner_id'          => $landOwners[$i - 1]->id,
                'plot_number'       => 'PLOT-' . strtoupper(Str::random(6)),
                'location'          => "{$i} Land Road, {$districts[$i - 1]} District",
                'district'          => $districts[$i - 1],
                'region'            => $regions[$i - 1],
                'area_sqm'          => mt_rand(200, 10000),
                'land_use'          => $landUses[$i - 1],
                'title_deed_number' => 'TD-' . strtoupper(Str::random(8)),
                'registration_date' => now()->subYears(mt_rand(1, 10))->toDateString(),
                'current_value'     => mt_rand(50000, 5000000),
                'status'            => $landStatuses[$i - 1],
                'encumbrances'      => $landStatuses[$i - 1] === 'mortgaged' ? 'Mortgaged to First National Bank.' : null,
            ]);
        }

        // ─── Grants (3) ─────────────────────────────────────────────────────
        $grantTypes = ['education', 'agriculture', 'business'];

        $grants = [];
        for ($i = 1; $i <= 3; $i++) {
            $budget   = mt_rand(100000, 1000000);
            $grants[] = Grant::create([
                'title'                => "Government {$grantTypes[$i - 1]} Grant #{$i}",
                'description'          => "This grant supports {$grantTypes[$i - 1]} initiatives across the country.",
                'grant_type'           => $grantTypes[$i - 1],
                'total_budget'         => $budget,
                'available_budget'     => $budget,
                'max_per_applicant'    => round($budget * 0.1, 2),
                'eligibility_criteria' => "Must be a registered citizen with a valid national ID. Must demonstrate need for {$grantTypes[$i - 1]} support.",
                'application_deadline' => now()->addMonths(3)->toDateString(),
                'disbursement_date'    => now()->addMonths(6)->toDateString(),
                'status'               => 'open',
                'created_by'           => $admin->id,
            ]);
        }

        // ─── Grant Applications (5) ─────────────────────────────────────────
        $appStatuses = ['submitted', 'under_review', 'approved', 'rejected', 'disbursed'];

        for ($i = 1; $i <= 5; $i++) {
            $grant   = $grants[($i - 1) % count($grants)];
            $status  = $appStatuses[$i - 1];
            $requested = min(mt_rand(5000, 50000), (float) $grant->max_per_applicant);

            GrantApplication::create([
                'grant_id'             => $grant->id,
                'applicant_id'         => ($i % 2 === 0) ? $citizen->id : $citizen2->id,
                'application_number'   => 'GA-' . strtoupper(Str::random(10)),
                'purpose'              => "Funding request for {$grant->grant_type} project #{$i}.",
                'amount_requested'     => $requested,
                'amount_approved'      => in_array($status, ['approved', 'disbursed']) ? $requested : null,
                'supporting_documents' => ['id_copy.pdf', 'business_plan.pdf'],
                'status'               => $status,
                'review_notes'         => in_array($status, ['approved', 'rejected', 'disbursed']) ? "Reviewed by officer on " . now()->subDays(5)->toDateString() : null,
                'reviewed_by'          => in_array($status, ['approved', 'rejected', 'disbursed']) ? $officer->id : null,
                'reviewed_at'          => in_array($status, ['approved', 'rejected', 'disbursed']) ? now()->subDays(5) : null,
                'disbursed_at'         => $status === 'disbursed' ? now()->subDays(1) : null,
            ]);
        }

        // ─── Law Cases (5) ──────────────────────────────────────────────────
        $caseTypes    = ['civil', 'criminal', 'administrative', 'family', 'commercial'];
        $caseStatuses = ['filed', 'pending', 'hearing', 'adjourned', 'verdict'];
        $priorities   = ['low', 'medium', 'high', 'urgent', 'medium'];

        for ($i = 1; $i <= 5; $i++) {
            LawCase::create([
                'case_number'         => 'CASE-' . date('Y') . '-' . strtoupper(Str::random(6)),
                'title'               => "Case #{$i}: " . ucfirst($caseTypes[$i - 1]) . " Matter",
                'description'         => "This is a {$caseTypes[$i - 1]} case involving parties in dispute #{$i}.",
                'case_type'           => $caseTypes[$i - 1],
                'plaintiff_name'      => "Plaintiff {$i} Name",
                'plaintiff_id'        => 'NID-P' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'defendant_name'      => "Defendant {$i} Name",
                'defendant_id'        => 'NID-D' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'presiding_officer'   => "Judge " . ['Smith', 'Brown', 'Davis', 'Wilson', 'Moore'][$i - 1],
                'filing_date'         => now()->subDays(mt_rand(10, 365))->toDateString(),
                'hearing_date'        => now()->addDays(mt_rand(5, 60))->toDateString(),
                'verdict_date'        => $caseStatuses[$i - 1] === 'verdict' ? now()->subDays(5)->toDateString() : null,
                'status'              => $caseStatuses[$i - 1],
                'verdict'             => $caseStatuses[$i - 1] === 'verdict' ? 'Ruling in favor of plaintiff.' : null,
                'assigned_officer_id' => $officer->id,
                'priority'            => $priorities[$i - 1],
            ]);
        }

        // ─── Citizen Registrations (5) ──────────────────────────────────────
        $genders       = ['male', 'female', 'male', 'female', 'other'];
        $maritalStatus = ['single', 'married', 'divorced', 'widowed', 'single'];
        $regTypes      = ['birth', 'death', 'marriage', 'divorce', 'citizenship'];
        $regStatuses   = ['pending', 'verified', 'approved', 'rejected', 'pending'];

        for ($i = 1; $i <= 5; $i++) {
            $status = $regStatuses[$i - 1];
            CitizenRegistration::create([
                'registration_number'     => 'REG-' . strtoupper(Str::random(10)),
                'first_name'              => ['Alice', 'Bob', 'Carol', 'David', 'Eve'][$i - 1],
                'last_name'               => ['Johnson', 'Williams', 'Taylor', 'Anderson', 'Thomas'][$i - 1],
                'date_of_birth'           => now()->subYears(mt_rand(18, 70))->toDateString(),
                'gender'                  => $genders[$i - 1],
                'national_id'             => 'CITREG-' . strtoupper(Str::random(8)),
                'passport_number'         => 'PP-' . strtoupper(Str::random(8)),
                'nationality'             => 'National',
                'marital_status'          => $maritalStatus[$i - 1],
                'address'                 => "{$i} Citizen Lane",
                'city'                    => ['Springfield', 'Shelbyville', 'Ogdenville', 'North Haverbrook', 'Capital City'][$i - 1],
                'region'                  => ['Metro', 'Highland', 'Coastal', 'Valley', 'Plains'][$i - 1],
                'phone'                   => '+1-555-' . str_pad(1000 + $i, 4, '0', STR_PAD_LEFT),
                'email'                   => strtolower(['alice', 'bob', 'carol', 'david', 'eve'][$i - 1]) . ".registration{$i}@example.com",
                'emergency_contact_name'  => "Emergency Contact {$i}",
                'emergency_contact_phone' => '+1-555-' . str_pad(2000 + $i, 4, '0', STR_PAD_LEFT),
                'registration_type'       => $regTypes[$i - 1],
                'status'                  => $status,
                'verified_by'             => in_array($status, ['verified', 'approved']) ? $officer->id : null,
                'verified_at'             => in_array($status, ['verified', 'approved']) ? now()->subDays(3) : null,
            ]);
        }
    }
}
