<?php

namespace App\Http\Controllers;

use App\Models\LawCase;
use App\Models\CaseHearing;
use Illuminate\Http\Request;

class LawCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = LawCase::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('case_number', 'like', "%{$request->search}%")
                  ->orWhere('title', 'like', "%{$request->search}%")
                  ->orWhere('plaintiff_name', 'like', "%{$request->search}%")
                  ->orWhere('defendant_name', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->case_type) {
            $query->where('case_type', $request->case_type);
        }
        if ($request->priority) {
            $query->where('priority', $request->priority);
        }
        if ($request->assigned_officer_id) {
            $query->where('assigned_officer_id', $request->assigned_officer_id);
        }
        return response()->json($query->withCount('hearings')->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'case_type' => 'required|in:civil,criminal,administrative,family,commercial,constitutional',
            'plaintiff_name' => 'required|string',
            'plaintiff_id' => 'nullable|string',
            'defendant_name' => 'required|string',
            'defendant_id' => 'nullable|string',
            'presiding_officer' => 'required|string',
            'filing_date' => 'required|date',
            'hearing_date' => 'nullable|date',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'assigned_officer_id' => 'nullable|integer',
        ]);
        $data['case_number'] = 'CASE-' . date('Y') . '-' . str_pad(LawCase::count() + 1, 4, '0', STR_PAD_LEFT);
        $data['status'] = 'filed';
        return response()->json(LawCase::create($data), 201);
    }

    public function show(LawCase $case)
    {
        return response()->json($case->load('hearings'));
    }

    public function update(Request $request, LawCase $case)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'case_type' => 'sometimes|in:civil,criminal,administrative,family,commercial,constitutional',
            'plaintiff_name' => 'sometimes|string',
            'plaintiff_id' => 'nullable|string',
            'defendant_name' => 'sometimes|string',
            'defendant_id' => 'nullable|string',
            'presiding_officer' => 'sometimes|string',
            'hearing_date' => 'nullable|date',
            'verdict_date' => 'nullable|date',
            'status' => 'sometimes|in:filed,pending,hearing,adjourned,verdict,closed,appealed',
            'verdict' => 'nullable|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'assigned_officer_id' => 'nullable|integer',
        ]);
        $case->update($data);
        return response()->json($case);
    }

    public function addHearing(Request $request, LawCase $case)
    {
        $data = $request->validate([
            'hearing_date' => 'required|date',
            'hearing_time' => 'required|date_format:H:i',
            'venue' => 'required|string',
            'outcome' => 'nullable|string',
            'next_hearing_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'recorded_by' => 'required|integer',
        ]);
        $data['law_case_id'] = $case->id;

        $hearing = CaseHearing::create($data);

        // Update case status based on hearing
        if ($data['outcome']) {
            $case->update([
                'status' => 'hearing',
                'hearing_date' => $data['hearing_date'],
            ]);
        }
        if ($data['next_hearing_date']) {
            $case->update(['hearing_date' => $data['next_hearing_date']]);
        }

        return response()->json($hearing, 201);
    }

    public function hearings(LawCase $case)
    {
        return response()->json($case->hearings()->orderBy('hearing_date', 'desc')->get());
    }

    public function stats()
    {
        return response()->json([
            'total_count' => LawCase::count(),
            'open_count' => LawCase::whereIn('status', ['filed', 'pending', 'hearing', 'adjourned'])->count(),
            'closed_count' => LawCase::whereIn('status', ['verdict', 'closed'])->count(),
            'appealed_count' => LawCase::where('status', 'appealed')->count(),
            'by_type' => LawCase::selectRaw('case_type, count(*) as count')->groupBy('case_type')->get(),
            'by_priority' => LawCase::selectRaw('priority, count(*) as count')->groupBy('priority')->get(),
            'total_hearings' => CaseHearing::count(),
        ]);
    }
}
