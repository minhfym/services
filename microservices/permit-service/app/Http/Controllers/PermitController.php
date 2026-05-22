<?php

namespace App\Http\Controllers;

use App\Models\Permit;
use Illuminate\Http\Request;

class PermitController extends Controller
{
    public function index(Request $request)
    {
        $query = Permit::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('applicant_name', 'like', "%{$request->search}%")
                  ->orWhere('permit_number', 'like', "%{$request->search}%")
                  ->orWhere('location', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->permit_type) {
            $query->where('permit_type', $request->permit_type);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|integer',
            'applicant_name' => 'required|string',
            'applicant_id' => 'required|string',
            'permit_type' => 'required|in:building,business,environmental,health,trade,fire_safety',
            'description' => 'required|string',
            'location' => 'required|string',
            'start_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after:start_date',
            'fee_amount' => 'nullable|numeric|min:0',
        ]);
        $data['permit_number'] = 'PERM-' . date('Y') . '-' . str_pad(Permit::count() + 1, 4, '0', STR_PAD_LEFT);
        $data['status'] = 'submitted';
        return response()->json(Permit::create($data), 201);
    }

    public function show(Permit $permit)
    {
        return response()->json($permit);
    }

    public function update(Request $request, Permit $permit)
    {
        $data = $request->validate([
            'applicant_name' => 'sometimes|string',
            'permit_type' => 'sometimes|in:building,business,environmental,health,trade,fire_safety',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'start_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'status' => 'sometimes|in:draft,submitted,under_review,approved,rejected,expired',
            'fee_amount' => 'nullable|numeric|min:0',
            'fee_paid' => 'sometimes|boolean',
        ]);
        $permit->update($data);
        return response()->json($permit);
    }

    public function approve(Request $request, Permit $permit)
    {
        $data = $request->validate([
            'approved_by' => 'required|integer',
            'start_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
        ]);
        $permit->update([
            'status' => 'approved',
            'approved_by' => $data['approved_by'],
            'approved_at' => now(),
            'start_date' => $data['start_date'] ?? $permit->start_date,
            'expiry_date' => $data['expiry_date'] ?? $permit->expiry_date,
            'rejection_reason' => null,
        ]);
        return response()->json($permit);
    }

    public function reject(Request $request, Permit $permit)
    {
        $data = $request->validate([
            'rejection_reason' => 'required|string',
        ]);
        $permit->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'],
        ]);
        return response()->json($permit);
    }

    public function stats()
    {
        return response()->json([
            'active_count' => Permit::where('status', 'approved')->count(),
            'pending_count' => Permit::whereIn('status', ['submitted', 'under_review'])->count(),
            'rejected_count' => Permit::where('status', 'rejected')->count(),
            'expired_count' => Permit::where('status', 'expired')->count(),
            'total_count' => Permit::count(),
            'fee_collected' => (float) Permit::where('fee_paid', true)->sum('fee_amount'),
        ]);
    }
}
