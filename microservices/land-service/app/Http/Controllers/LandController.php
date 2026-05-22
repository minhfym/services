<?php

namespace App\Http\Controllers;

use App\Models\LandRecord;
use App\Models\LandTransfer;
use Illuminate\Http\Request;

class LandController extends Controller
{
    public function index(Request $request)
    {
        $query = LandRecord::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('plot_number', 'like', "%{$request->search}%")
                  ->orWhere('title_deed_number', 'like', "%{$request->search}%")
                  ->orWhere('location', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->owner_id) {
            $query->where('owner_id', $request->owner_id);
        }
        if ($request->district) {
            $query->where('district', 'like', "%{$request->district}%");
        }
        if ($request->region) {
            $query->where('region', 'like', "%{$request->region}%");
        }
        if ($request->land_use) {
            $query->where('land_use', $request->land_use);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'owner_id' => 'required|integer',
            'plot_number' => 'required|string|unique:land_records',
            'location' => 'required|string',
            'district' => 'required|string',
            'region' => 'required|string',
            'area_sqm' => 'required|numeric|min:0',
            'land_use' => 'required|in:residential,commercial,agricultural,industrial,public',
            'title_deed_number' => 'required|string|unique:land_records',
            'registration_date' => 'required|date',
            'current_value' => 'nullable|numeric|min:0',
            'encumbrances' => 'nullable|string',
        ]);
        $data['status'] = 'registered';
        return response()->json(LandRecord::create($data), 201);
    }

    public function show(LandRecord $land)
    {
        return response()->json($land->load('transfers'));
    }

    public function update(Request $request, LandRecord $land)
    {
        $data = $request->validate([
            'location' => 'sometimes|string',
            'district' => 'sometimes|string',
            'region' => 'sometimes|string',
            'area_sqm' => 'sometimes|numeric|min:0',
            'land_use' => 'sometimes|in:residential,commercial,agricultural,industrial,public',
            'current_value' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:registered,under_transfer,disputed,mortgaged',
            'encumbrances' => 'nullable|string',
        ]);
        $land->update($data);
        return response()->json($land);
    }

    public function transfer(Request $request, LandRecord $land)
    {
        $data = $request->validate([
            'to_owner_id' => 'required|integer',
            'transfer_date' => 'required|date',
            'transfer_value' => 'required|numeric|min:0',
            'reason' => 'required|string',
            'processed_by' => 'nullable|integer',
        ]);

        $transfer = LandTransfer::create([
            'land_record_id' => $land->id,
            'from_owner_id' => $land->owner_id,
            'to_owner_id' => $data['to_owner_id'],
            'transfer_date' => $data['transfer_date'],
            'transfer_value' => $data['transfer_value'],
            'reason' => $data['reason'],
            'status' => 'pending',
            'processed_by' => $data['processed_by'] ?? null,
        ]);

        $land->update(['status' => 'under_transfer']);

        return response()->json([
            'transfer' => $transfer,
            'land' => $land->fresh(),
        ], 201);
    }

    public function completeTransfer(Request $request, LandRecord $land, LandTransfer $transfer)
    {
        if ($transfer->land_record_id !== $land->id) {
            return response()->json(['error' => 'Transfer does not belong to this land record'], 400);
        }
        $transfer->update(['status' => 'completed']);
        $land->update([
            'owner_id' => $transfer->to_owner_id,
            'status' => 'registered',
            'current_value' => $transfer->transfer_value,
        ]);
        return response()->json(['transfer' => $transfer, 'land' => $land->fresh()]);
    }

    public function stats()
    {
        return response()->json([
            'total_count' => LandRecord::count(),
            'registered_count' => LandRecord::where('status', 'registered')->count(),
            'under_transfer_count' => LandRecord::where('status', 'under_transfer')->count(),
            'disputed_count' => LandRecord::where('status', 'disputed')->count(),
            'mortgaged_count' => LandRecord::where('status', 'mortgaged')->count(),
            'total_value' => (float) LandRecord::sum('current_value'),
            'pending_transfers' => LandTransfer::where('status', 'pending')->count(),
        ]);
    }
}
