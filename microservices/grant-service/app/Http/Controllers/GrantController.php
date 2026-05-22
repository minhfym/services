<?php

namespace App\Http\Controllers;

use App\Models\Grant;
use App\Models\GrantApplication;
use Illuminate\Http\Request;

class GrantController extends Controller
{
    public function index(Request $request)
    {
        $query = Grant::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->grant_type) {
            $query->where('grant_type', $request->grant_type);
        }
        return response()->json($query->withCount('applications')->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'grant_type' => 'required|in:education,agriculture,business,health,infrastructure,social',
            'total_budget' => 'required|numeric|min:0',
            'max_per_applicant' => 'required|numeric|min:0',
            'eligibility_criteria' => 'required|string',
            'application_deadline' => 'required|date',
            'disbursement_date' => 'nullable|date',
            'created_by' => 'required|integer',
        ]);
        $data['available_budget'] = $data['total_budget'];
        $data['status'] = 'open';
        return response()->json(Grant::create($data), 201);
    }

    public function show(Grant $grant)
    {
        return response()->json($grant->load('applications'));
    }

    public function update(Request $request, Grant $grant)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'grant_type' => 'sometimes|in:education,agriculture,business,health,infrastructure,social',
            'total_budget' => 'sometimes|numeric|min:0',
            'max_per_applicant' => 'sometimes|numeric|min:0',
            'eligibility_criteria' => 'sometimes|string',
            'application_deadline' => 'sometimes|date',
            'disbursement_date' => 'nullable|date',
            'status' => 'sometimes|in:open,closed,completed',
        ]);
        $grant->update($data);
        return response()->json($grant);
    }

    public function stats()
    {
        return response()->json([
            'open_count' => Grant::where('status', 'open')->count(),
            'closed_count' => Grant::where('status', 'closed')->count(),
            'completed_count' => Grant::where('status', 'completed')->count(),
            'total_budget' => (float) Grant::sum('total_budget'),
            'available_budget' => (float) Grant::sum('available_budget'),
            'applications_count' => GrantApplication::count(),
            'disbursed_amount' => (float) GrantApplication::where('status', 'disbursed')->sum('amount_approved'),
            'pending_applications' => GrantApplication::whereIn('status', ['submitted', 'under_review'])->count(),
        ]);
    }
}
