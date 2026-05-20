<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grant;
use Illuminate\Http\Request;

class GrantController extends Controller
{
    public function index(Request $request)
    {
        $query = Grant::with('creator');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('grant_type')) {
            $query->where('grant_type', $request->grant_type);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $grants = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($grants);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'                => 'required|string|max:255',
            'description'          => 'required|string',
            'grant_type'           => 'required|in:education,agriculture,business,health,infrastructure,social',
            'total_budget'         => 'required|numeric|min:0',
            'available_budget'     => 'nullable|numeric|min:0',
            'max_per_applicant'    => 'required|numeric|min:0',
            'eligibility_criteria' => 'required|string',
            'application_deadline' => 'required|date|after:today',
            'disbursement_date'    => 'nullable|date',
            'status'               => 'nullable|in:open,closed,completed',
        ]);

        $validated['created_by']        = $request->user()->id;
        $validated['available_budget']  = $validated['available_budget'] ?? $validated['total_budget'];
        $validated['status']            = $validated['status'] ?? 'open';

        $grant = Grant::create($validated);

        return response()->json([
            'message' => 'Grant created successfully',
            'data'    => $grant->load('creator'),
        ], 201);
    }

    public function show(Grant $grant)
    {
        return response()->json([
            'data' => $grant->load(['creator', 'applications.applicant']),
        ]);
    }

    public function update(Request $request, Grant $grant)
    {
        $validated = $request->validate([
            'title'                => 'sometimes|string|max:255',
            'description'          => 'sometimes|string',
            'grant_type'           => 'sometimes|in:education,agriculture,business,health,infrastructure,social',
            'total_budget'         => 'sometimes|numeric|min:0',
            'available_budget'     => 'nullable|numeric|min:0',
            'max_per_applicant'    => 'sometimes|numeric|min:0',
            'eligibility_criteria' => 'sometimes|string',
            'application_deadline' => 'sometimes|date',
            'disbursement_date'    => 'nullable|date',
            'status'               => 'sometimes|in:open,closed,completed',
        ]);

        $grant->update($validated);

        return response()->json([
            'message' => 'Grant updated successfully',
            'data'    => $grant->fresh()->load('creator'),
        ]);
    }

    public function destroy(Grant $grant)
    {
        $grant->delete();
        return response()->json(['message' => 'Grant deleted successfully']);
    }
}
