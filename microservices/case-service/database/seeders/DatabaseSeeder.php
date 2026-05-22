<?php

namespace Database\Seeders;

use App\Models\LawCase;
use App\Models\CaseHearing;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $cases = [
            [
                'case_number' => 'CASE-2024-0001',
                'title' => 'Johnson vs. Northern Construction Ltd',
                'description' => 'Property damage claim arising from negligent construction work causing structural damage to neighboring property',
                'case_type' => 'civil',
                'plaintiff_name' => 'Robert Johnson',
                'plaintiff_id' => 'NID-101-2024',
                'defendant_name' => 'Northern Construction Ltd',
                'defendant_id' => 'REG-NCL-2019',
                'presiding_officer' => 'Justice M. Adeyemi',
                'filing_date' => '2024-01-15',
                'hearing_date' => '2024-08-20',
                'verdict_date' => null,
                'status' => 'hearing',
                'verdict' => null,
                'assigned_officer_id' => 2,
                'priority' => 'medium',
            ],
            [
                'case_number' => 'CASE-2024-0002',
                'title' => 'State vs. Mark Williams - Fraud',
                'description' => 'Criminal prosecution for financial fraud involving misappropriation of public funds',
                'case_type' => 'criminal',
                'plaintiff_name' => 'The State',
                'plaintiff_id' => null,
                'defendant_name' => 'Mark Williams',
                'defendant_id' => 'NID-202-2024',
                'presiding_officer' => 'Justice P. Okonkwo',
                'filing_date' => '2024-02-10',
                'hearing_date' => '2024-09-05',
                'verdict_date' => null,
                'status' => 'pending',
                'verdict' => null,
                'assigned_officer_id' => 2,
                'priority' => 'urgent',
            ],
            [
                'case_number' => 'CASE-2024-0003',
                'title' => 'Green Valley Farms vs. Water Authority',
                'description' => 'Administrative dispute over water rights allocation and irrigation licenses',
                'case_type' => 'administrative',
                'plaintiff_name' => 'Green Valley Farms Ltd',
                'plaintiff_id' => 'REG-GVF-2015',
                'defendant_name' => 'National Water Authority',
                'defendant_id' => 'GOV-NWA-001',
                'presiding_officer' => 'Justice L. Mensah',
                'filing_date' => '2024-03-20',
                'hearing_date' => null,
                'verdict_date' => null,
                'status' => 'filed',
                'verdict' => null,
                'assigned_officer_id' => null,
                'priority' => 'high',
            ],
            [
                'case_number' => 'CASE-2024-0004',
                'title' => 'Smith Divorce Proceedings',
                'description' => 'Dissolution of marriage and child custody determination for the Smith family',
                'case_type' => 'family',
                'plaintiff_name' => 'Sarah Smith',
                'plaintiff_id' => 'NID-304-2024',
                'defendant_name' => 'David Smith',
                'defendant_id' => 'NID-305-2024',
                'presiding_officer' => 'Justice A. Boateng',
                'filing_date' => '2024-04-05',
                'hearing_date' => '2024-07-15',
                'verdict_date' => '2024-07-15',
                'status' => 'closed',
                'verdict' => 'Divorce granted. Joint custody of minor children awarded. Asset division completed per mutual agreement.',
                'assigned_officer_id' => 2,
                'priority' => 'medium',
            ],
            [
                'case_number' => 'CASE-2024-0005',
                'title' => 'TechCorp vs. DataSolutions - Breach of Contract',
                'description' => 'Commercial dispute over software development contract breach and recovery of advance payments',
                'case_type' => 'commercial',
                'plaintiff_name' => 'TechCorp Inc',
                'plaintiff_id' => 'REG-TCI-2020',
                'defendant_name' => 'DataSolutions Ltd',
                'defendant_id' => 'REG-DSL-2018',
                'presiding_officer' => 'Justice F. Asante',
                'filing_date' => '2024-05-12',
                'hearing_date' => '2024-10-01',
                'verdict_date' => null,
                'status' => 'adjourned',
                'verdict' => null,
                'assigned_officer_id' => 2,
                'priority' => 'high',
            ],
        ];

        foreach ($cases as $caseData) {
            $lawCase = LawCase::create($caseData);

            // Add a hearing for case 1 (in hearing status)
            if ($lawCase->case_number === 'CASE-2024-0001') {
                CaseHearing::create([
                    'law_case_id' => $lawCase->id,
                    'hearing_date' => '2024-05-10',
                    'hearing_time' => '09:00',
                    'venue' => 'High Court Room 3, Main Courthouse',
                    'outcome' => 'Initial hearing completed. Plaintiff submitted evidence. Defendant requested 60-day extension for expert witness.',
                    'next_hearing_date' => '2024-08-20',
                    'notes' => 'Judge granted extension. Both parties to submit expert reports by August 1st.',
                    'recorded_by' => 2,
                ]);
            }
        }
    }
}
