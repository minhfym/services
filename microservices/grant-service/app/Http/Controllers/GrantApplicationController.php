<?php

namespace App\Http\Controllers;

use App\Models\Grant;
use App\Models\GrantApplication;
use Illuminate\Http\Request;

class GrantApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = GrantApplication::with('grant');
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('application_number', 'like', "%{$request->search}%")
                  ->orWhere('purpose', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->applicant_id) {
            $query->where('applicant_id', $request->applicant_id);
        }
        if ($request->grant_id) {
            $query->where('grant_id', $request->grant_id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'grant_id' => 'required|integer|exists:grants,id',
            'applicant_id' => 'required|integer',
            'purpose' => 'required|string',
            'amount_requested' => 'required|numeric|min:0',
            'supporting_documents' => 'nullable|array',
        ]);

        $grant = Grant::findOrFail($data['grant_id']);

        if ($grant->status !== 'open') {
            return response()->json(['error' => 'Grant is not accepting applications'], 422);
        }

        if ($data['amount_requested'] > $grant->max_per_applicant) {
            return response()->json([
                'error' => 'Requested amount exceeds maximum per applicant: ' . $grant->max_per_applicant
            ], 422);
        }

        $data['application_number'] = 'APP-' . date('Y') . '-' . str_pad(GrantApplication::count() + 1, 4, '0', STR_PAD_LEFT);
        $data['status'] = 'submitted';

        return response()->json(GrantApplication::create($data), 201);
    }

    public function show(GrantApplication $app)
    {
        return response()->json($app->load('grant'));
    }

    public function update(Request $request, GrantApplication $app)
    {
        $data = $request->validate([
            'purpose' => 'sometimes|string',
            'amount_requested' => 'sometimes|numeric|min:0',
            'supporting_documents' => 'nullable|array',
            'status' => 'sometimes|in:draft,submitted,under_review,approved,rejected,disbursed',
            'review_notes' => 'nullable|string',
        ]);
        $app->update($data);
        return response()->json($app);
    }

    public function approve(Request $request, GrantApplication $app)
    {
        $data = $request->validate([
            'amount_approved' => 'required|numeric|min:0',
            'reviewed_by' => 'required|integer',
            'review_notes' => 'nullable|string',
        ]);

        $grant = Grant::findOrFail($app->grant_id);

        if ($data['amount_approved'] > $grant->available_budget) {
            return response()->json(['error' => 'Insufficient grant budget available'], 422);
        }

        $app->update([
            'status' => 'approved',
            'amount_approved' => $data['amount_approved'],
            'reviewed_by' => $data['reviewed_by'],
            'reviewed_at' => now(),
            'review_notes' => $data['review_notes'] ?? null,
        ]);

        // Deduct from available budget
        $grant->decrement('available_budget', $data['amount_approved']);

        return response()->json($app->fresh());
    }

    public function reject(Request $request, GrantApplication $app)
    {
        $data = $request->validate([
            'reviewed_by' => 'required|integer',
            'review_notes' => 'required|string',
        ]);

        $app->update([
            'status' => 'rejected',
            'reviewed_by' => $data['reviewed_by'],
            'reviewed_at' => now(),
            'review_notes' => $data['review_notes'],
        ]);

        return response()->json($app);
    }

    public function disburse(Request $request, GrantApplication $app)
    {
        if ($app->status !== 'approved') {
            return response()->json(['error' => 'Application must be approved before disbursement'], 422);
        }

        $app->update([
            'status' => 'disbursed',
            'disbursed_at' => now(),
        ]);

        return response()->json($app);
    }
}
