<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CitizenRegistration;
use App\Models\Grant;
use App\Models\LandRecord;
use App\Models\LawCase;
use App\Models\Permit;
use App\Models\TaxRecord;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        // Tax stats
        $taxQuery          = TaxRecord::query();
        $totalTaxes        = $taxQuery->count();
        $totalCollected    = TaxRecord::sum('amount_paid');
        $pendingTaxes      = TaxRecord::whereIn('status', ['pending', 'overdue', 'partial'])->count();

        // Permit stats
        $totalPermits      = Permit::count();
        $activePermits     = Permit::where('status', 'approved')->count();
        $pendingPermits    = Permit::whereIn('status', ['submitted', 'under_review'])->count();

        // Land stats
        $totalLands        = LandRecord::count();

        // Grant stats
        $totalGrants       = Grant::count();
        $activeGrants      = Grant::where('status', 'open')->count();

        // Case stats
        $totalCases        = LawCase::count();
        $openCases         = LawCase::whereNotIn('status', ['closed', 'verdict'])->count();

        // Registration stats
        $totalRegistrations   = CitizenRegistration::count();
        $pendingRegistrations = CitizenRegistration::where('status', 'pending')->count();

        return response()->json([
            'data' => [
                // Taxes
                'total_taxes'             => $totalTaxes,
                'total_collected'         => (float) $totalCollected,
                'pending_taxes'           => $pendingTaxes,

                // Permits
                'total_permits'           => $totalPermits,
                'active_permits'          => $activePermits,
                'pending_permits'         => $pendingPermits,

                // Land
                'total_lands'             => $totalLands,

                // Grants
                'total_grants'            => $totalGrants,
                'active_grants'           => $activeGrants,

                // Cases
                'total_cases'             => $totalCases,
                'open_cases'              => $openCases,

                // Registrations
                'total_registrations'     => $totalRegistrations,
                'pending_registrations'   => $pendingRegistrations,
            ],
        ]);
    }
}
