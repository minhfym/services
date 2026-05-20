<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseHearing;
use App\Models\LawCase;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LawCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = LawCase::with('assignedOfficer');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('case_type')) {
            $query->where('case_type', $request->case_type);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('case_number', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('plaintiff_name', 'like', "%{$search}%")
                  ->orWhere('defendant_name', 'like', "%{$search}%");
            });
        }

        $cases = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($cases);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'description'         => 'required|string',
            'case_type'           => 'required|in:civil,criminal,administrative,family,commercial,constitutional',
            'plaintiff_name'      => 'required|string|max:255',
            'plaintiff_id'        => 'nullable|string|max:100',
            'defendant_name'      => 'required|string|max:255',
            'defendant_id'        => 'nullable|string|max:100',
            'presiding_officer'   => 'required|string|max:255',
            'filing_date'         => 'required|date',
            'hearing_date'        => 'nullable|date',
            'status'              => 'nullable|in:filed,pending,hearing,adjourned,verdict,closed,appealed',
            'assigned_officer_id' => 'nullable|exists:users,id',
            'priority'            => 'nullable|in:low,medium,high,urgent',
        ]);

        $validated['case_number'] = 'CASE-' . date('Y') . '-' . strtoupper(Str::random(6));
        $validated['status']      = $validated['status'] ?? 'filed';
        $validated['priority']    = $validated['priority'] ?? 'medium';

        $case = LawCase::create($validated);

        return response()->json([
            'message' => 'Case filed successfully',
            'data'    => $case->load('assignedOfficer'),
        ], 201);
    }

    public function show(LawCase $case)
    {
        return response()->json([
            'data' => $case->load(['assignedOfficer', 'hearings.recorder']),
        ]);
    }

    public function update(Request $request, LawCase $case)
    {
        $validated = $request->validate([
            'title'               => 'sometimes|string|max:255',
            'description'         => 'sometimes|string',
            'case_type'           => 'sometimes|in:civil,criminal,administrative,family,commercial,constitutional',
            'plaintiff_name'      => 'sometimes|string|max:255',
            'plaintiff_id'        => 'nullable|string|max:100',
            'defendant_name'      => 'sometimes|string|max:255',
            'defendant_id'        => 'nullable|string|max:100',
            'presiding_officer'   => 'sometimes|string|max:255',
            'filing_date'         => 'sometimes|date',
            'hearing_date'        => 'nullable|date',
            'verdict_date'        => 'nullable|date',
            'status'              => 'sometimes|in:filed,pending,hearing,adjourned,verdict,closed,appealed',
            'verdict'             => 'nullable|string',
            'assigned_officer_id' => 'nullable|exists:users,id',
            'priority'            => 'sometimes|in:low,medium,high,urgent',
        ]);

        $case->update($validated);

        return response()->json([
            'message' => 'Case updated successfully',
            'data'    => $case->fresh()->load('assignedOfficer'),
        ]);
    }

    public function addHearing(Request $request, LawCase $case)
    {
        $validated = $request->validate([
            'hearing_date'      => 'required|date',
            'hearing_time'      => 'required|date_format:H:i',
            'venue'             => 'required|string|max:255',
            'outcome'           => 'nullable|string',
            'next_hearing_date' => 'nullable|date|after:hearing_date',
            'notes'             => 'nullable|string',
        ]);

        $validated['law_case_id'] = $case->id;
        $validated['recorded_by'] = $request->user()->id;

        $hearing = CaseHearing::create($validated);

        // Update case hearing date
        $case->update(['hearing_date' => $validated['hearing_date'], 'status' => 'hearing']);

        return response()->json([
            'message' => 'Hearing recorded successfully',
            'data'    => $hearing->load(['lawCase', 'recorder']),
        ], 201);
    }

    public function hearings(LawCase $case)
    {
        $hearings = $case->hearings()->with('recorder')->orderBy('hearing_date', 'desc')->get();

        return response()->json(['data' => $hearings]);
    }

    public function destroy(LawCase $case)
    {
        $case->delete();
        return response()->json(['message' => 'Case deleted successfully']);
    }
}
