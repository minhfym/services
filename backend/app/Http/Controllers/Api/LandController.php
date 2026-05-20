<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LandRecord;
use App\Models\LandTransfer;
use Illuminate\Http\Request;

class LandController extends Controller
{
    public function index(Request $request)
    {
        $query = LandRecord::with('owner');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('land_use')) {
            $query->where('land_use', $request->land_use);
        }
        if ($request->filled('district')) {
            $query->where('district', 'like', '%' . $request->district . '%');
        }
        if ($request->filled('region')) {
            $query->where('region', 'like', '%' . $request->region . '%');
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('plot_number', 'like', "%{$search}%")
                  ->orWhere('title_deed_number', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->user()->role === 'citizen') {
            $query->where('owner_id', $request->user()->id);
        }

        $lands = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($lands);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'owner_id'           => 'required|exists:users,id',
            'plot_number'        => 'required|string|max:100|unique:land_records',
            'location'           => 'required|string|max:500',
            'district'           => 'required|string|max:100',
            'region'             => 'required|string|max:100',
            'area_sqm'           => 'required|numeric|min:0',
            'land_use'           => 'required|in:residential,commercial,agricultural,industrial,public',
            'title_deed_number'  => 'required|string|max:100',
            'registration_date'  => 'required|date',
            'current_value'      => 'nullable|numeric|min:0',
            'status'             => 'nullable|in:registered,under_transfer,disputed,mortgaged',
            'encumbrances'       => 'nullable|string',
        ]);

        $validated['current_value'] = $validated['current_value'] ?? 0;
        $validated['status']        = $validated['status'] ?? 'registered';

        $land = LandRecord::create($validated);

        return response()->json([
            'message' => 'Land record created successfully',
            'data'    => $land->load('owner'),
        ], 201);
    }

    public function show(Request $request, LandRecord $land)
    {
        if ($request->user()->role === 'citizen' && $land->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['data' => $land->load(['owner', 'transfers.fromOwner', 'transfers.toOwner'])]);
    }

    public function update(Request $request, LandRecord $land)
    {
        $validated = $request->validate([
            'location'          => 'sometimes|string|max:500',
            'district'          => 'sometimes|string|max:100',
            'region'            => 'sometimes|string|max:100',
            'area_sqm'          => 'sometimes|numeric|min:0',
            'land_use'          => 'sometimes|in:residential,commercial,agricultural,industrial,public',
            'title_deed_number' => 'sometimes|string|max:100',
            'current_value'     => 'nullable|numeric|min:0',
            'status'            => 'sometimes|in:registered,under_transfer,disputed,mortgaged',
            'encumbrances'      => 'nullable|string',
        ]);

        $land->update($validated);

        return response()->json([
            'message' => 'Land record updated successfully',
            'data'    => $land->fresh()->load('owner'),
        ]);
    }

    public function transfer(Request $request, LandRecord $land)
    {
        $validated = $request->validate([
            'to_owner_id'    => 'required|exists:users,id|different:' . $land->owner_id,
            'transfer_date'  => 'required|date',
            'transfer_value' => 'required|numeric|min:0',
            'reason'         => 'nullable|string',
        ]);

        // Create transfer record
        $transfer = LandTransfer::create([
            'land_record_id' => $land->id,
            'from_owner_id'  => $land->owner_id,
            'to_owner_id'    => $validated['to_owner_id'],
            'transfer_date'  => $validated['transfer_date'],
            'transfer_value' => $validated['transfer_value'],
            'reason'         => $validated['reason'] ?? null,
            'status'         => 'pending',
            'processed_by'   => $request->user()->id,
        ]);

        // Update land status to under_transfer
        $land->update(['status' => 'under_transfer']);

        return response()->json([
            'message'  => 'Transfer initiated successfully',
            'transfer' => $transfer->load(['fromOwner', 'toOwner', 'processedBy']),
            'land'     => $land->fresh()->load('owner'),
        ], 201);
    }

    public function destroy(LandRecord $land)
    {
        $land->delete();
        return response()->json(['message' => 'Land record deleted successfully']);
    }
}
