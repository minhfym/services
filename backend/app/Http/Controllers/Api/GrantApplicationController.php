<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grant;
use App\Models\GrantApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrantApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = GrantApplication::with(['grant', 'applicant', 'reviewer']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('grant_id')) {
            $query->where('grant_id', $request->grant_id);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('application_number', 'like', "%{$search}%")
                  ->orWhere('purpose', 'like', "%{$search}%");
            });
        }

        if ($request->user()->role === 'citizen') {
            $query->where('applicant_id', $request->user()->id);
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grant_id'             => 'required|exists:grants,id',
            'purpose'              => 'required|string',
            'amount_requested'     => 'required|numeric|min:0',
            'supporting_documents' => 'nullable|array',
        ]);

        $grant = Grant::findOrFail($validated['grant_id']);

        if ($grant->status !== 'open') {
            return response()->json(['message' => 'This grant is not currently accepting applications'], 422);
        }

        if ($validated['amount_requested'] > $grant->max_per_applicant) {
            return response()->json([
                'message' => "Amount exceeds maximum per applicant of {$grant->max_per_applicant}",
            ], 422);
        }

        $application = GrantApplication::create([
            'grant_id'             => $validated['grant_id'],
            'applicant_id'         => $request->user()->id,
            'application_number'   => 'GA-' . strtoupper(Str::random(10)),
            'purpose'              => $validated['purpose'],
            'amount_requested'     => $validated['amount_requested'],
            'supporting_documents' => $validated['supporting_documents'] ?? null,
            'status'               => 'submitted',
        ]);

        return response()->json([
            'message' => 'Grant application submitted successfully',
            'data'    => $application->load(['grant', 'applicant']),
        ], 201);
    }

    public function show(Request $request, GrantApplication $grantApplication)
    {
        if ($request->user()->role === 'citizen' && $grantApplication->applicant_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['data' => $grantApplication->load(['grant', 'applicant', 'reviewer'])]);
    }

    public function update(Request $request, GrantApplication $grantApplication)
    {
        $validated = $request->validate([
            'purpose'              => 'sometimes|string',
            'amount_requested'     => 'sometimes|numeric|min:0',
            'supporting_documents' => 'nullable|array',
            'status'               => 'sometimes|in:draft,submitted,under_review,approved,rejected,disbursed',
            'review_notes'         => 'nullable|string',
        ]);

        $grantApplication->update($validated);

        return response()->json([
            'message' => 'Grant application updated successfully',
            'data'    => $grantApplication->fresh()->load(['grant', 'applicant', 'reviewer']),
        ]);
    }

    public function approve(Request $request, GrantApplication $grantApplication)
    {
        $validated = $request->validate([
            'amount_approved' => 'required|numeric|min:0',
            'review_notes'    => 'nullable|string',
        ]);

        $grant = $grantApplication->grant;

        if ($validated['amount_approved'] > $grant->available_budget) {
            return response()->json(['message' => 'Insufficient available grant budget'], 422);
        }

        $grantApplication->update([
            'status'          => 'approved',
            'amount_approved' => $validated['amount_approved'],
            'review_notes'    => $validated['review_notes'] ?? null,
            'reviewed_by'     => $request->user()->id,
            'reviewed_at'     => now(),
        ]);

        // Deduct from available budget
        $grant->decrement('available_budget', $validated['amount_approved']);

        return response()->json([
            'message' => 'Grant application approved successfully',
            'data'    => $grantApplication->fresh()->load(['grant', 'applicant', 'reviewer']),
        ]);
    }

    public function reject(Request $request, GrantApplication $grantApplication)
    {
        $validated = $request->validate([
            'review_notes' => 'required|string',
        ]);

        $grantApplication->update([
            'status'       => 'rejected',
            'review_notes' => $validated['review_notes'],
            'reviewed_by'  => $request->user()->id,
            'reviewed_at'  => now(),
        ]);

        return response()->json([
            'message' => 'Grant application rejected',
            'data'    => $grantApplication->fresh()->load(['grant', 'applicant', 'reviewer']),
        ]);
    }

    public function disburse(Request $request, GrantApplication $grantApplication)
    {
        if ($grantApplication->status !== 'approved') {
            return response()->json(['message' => 'Only approved applications can be disbursed'], 422);
        }

        $grantApplication->update([
            'status'       => 'disbursed',
            'disbursed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Grant disbursed successfully',
            'data'    => $grantApplication->fresh()->load(['grant', 'applicant', 'reviewer']),
        ]);
    }

    public function destroy(GrantApplication $grantApplication)
    {
        $grantApplication->delete();
        return response()->json(['message' => 'Grant application deleted successfully']);
    }
}
