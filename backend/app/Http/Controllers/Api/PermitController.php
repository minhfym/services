<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermitController extends Controller
{
    public function index(Request $request)
    {
        $query = Permit::with(['user', 'approvedBy']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('permit_type')) {
            $query->where('permit_type', $request->permit_type);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('applicant_name', 'like', "%{$search}%")
                  ->orWhere('permit_number', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->user()->role === 'citizen') {
            $query->where('user_id', $request->user()->id);
        }

        $permits = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($permits);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'applicant_name' => 'required|string|max:255',
            'applicant_id'   => 'required|string|max:100',
            'permit_type'    => 'required|in:building,business,environmental,health,trade,fire_safety',
            'description'    => 'required|string',
            'location'       => 'required|string|max:500',
            'start_date'     => 'nullable|date',
            'expiry_date'    => 'nullable|date|after_or_equal:start_date',
            'fee_amount'     => 'nullable|numeric|min:0',
            'fee_paid'       => 'nullable|boolean',
        ]);

        $validated['permit_number'] = 'PRM-' . strtoupper(Str::random(8));
        $validated['status']        = 'draft';
        $validated['fee_amount']    = $validated['fee_amount'] ?? 0;
        $validated['fee_paid']      = $validated['fee_paid'] ?? false;

        $permit = Permit::create($validated);

        return response()->json([
            'message' => 'Permit application created successfully',
            'data'    => $permit->load(['user', 'approvedBy']),
        ], 201);
    }

    public function show(Request $request, Permit $permit)
    {
        if ($request->user()->role === 'citizen' && $permit->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['data' => $permit->load(['user', 'approvedBy'])]);
    }

    public function update(Request $request, Permit $permit)
    {
        $validated = $request->validate([
            'applicant_name' => 'sometimes|string|max:255',
            'applicant_id'   => 'sometimes|string|max:100',
            'permit_type'    => 'sometimes|in:building,business,environmental,health,trade,fire_safety',
            'description'    => 'sometimes|string',
            'location'       => 'sometimes|string|max:500',
            'start_date'     => 'nullable|date',
            'expiry_date'    => 'nullable|date',
            'status'         => 'sometimes|in:draft,submitted,under_review,approved,rejected,expired',
            'fee_amount'     => 'nullable|numeric|min:0',
            'fee_paid'       => 'nullable|boolean',
        ]);

        $permit->update($validated);

        return response()->json([
            'message' => 'Permit updated successfully',
            'data'    => $permit->fresh()->load(['user', 'approvedBy']),
        ]);
    }

    public function approve(Request $request, Permit $permit)
    {
        $validated = $request->validate([
            'start_date'  => 'nullable|date',
            'expiry_date' => 'nullable|date',
        ]);

        $permit->update([
            'status'      => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'start_date'  => $validated['start_date'] ?? now()->toDateString(),
            'expiry_date' => $validated['expiry_date'] ?? now()->addYear()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Permit approved successfully',
            'data'    => $permit->fresh()->load(['user', 'approvedBy']),
        ]);
    }

    public function reject(Request $request, Permit $permit)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $permit->update([
            'status'           => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Permit rejected',
            'data'    => $permit->fresh()->load(['user', 'approvedBy']),
        ]);
    }

    public function destroy(Permit $permit)
    {
        $permit->delete();
        return response()->json(['message' => 'Permit deleted successfully']);
    }
}
