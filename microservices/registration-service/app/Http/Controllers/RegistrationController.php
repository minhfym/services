<?php

namespace App\Http\Controllers;

use App\Models\CitizenRegistration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = CitizenRegistration::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('national_id', 'like', "%{$request->search}%")
                  ->orWhere('registration_number', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->registration_type) {
            $query->where('registration_type', $request->registration_type);
        }
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'national_id' => 'required|string|unique:citizen_registrations',
            'passport_number' => 'nullable|string',
            'nationality' => 'required|string',
            'marital_status' => 'required|in:single,married,divorced,widowed',
            'address' => 'required|string',
            'city' => 'required|string',
            'region' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'emergency_contact_name' => 'required|string',
            'emergency_contact_phone' => 'required|string',
            'registration_type' => 'required|in:birth,death,marriage,divorce,citizenship',
            'user_id' => 'required|integer',
        ]);
        $data['registration_number'] = 'REG-' . date('Y') . '-' . str_pad(CitizenRegistration::count() + 1, 5, '0', STR_PAD_LEFT);
        $data['status'] = 'pending';
        return response()->json(CitizenRegistration::create($data), 201);
    }

    public function show(CitizenRegistration $registration)
    {
        return response()->json($registration);
    }

    public function update(Request $request, CitizenRegistration $registration)
    {
        $data = $request->validate([
            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'date_of_birth' => 'sometimes|date',
            'gender' => 'sometimes|in:male,female,other',
            'passport_number' => 'nullable|string',
            'nationality' => 'sometimes|string',
            'marital_status' => 'sometimes|in:single,married,divorced,widowed',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'region' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'email' => 'nullable|email',
            'emergency_contact_name' => 'sometimes|string',
            'emergency_contact_phone' => 'sometimes|string',
            'registration_type' => 'sometimes|in:birth,death,marriage,divorce,citizenship',
            'status' => 'sometimes|in:pending,verified,approved,rejected',
        ]);
        $registration->update($data);
        return response()->json($registration);
    }

    public function verify(Request $request, CitizenRegistration $registration)
    {
        $data = $request->validate([
            'verified_by' => 'required|integer',
            'notes' => 'nullable|string',
        ]);

        if ($registration->status !== 'pending') {
            return response()->json(['error' => 'Registration must be in pending status to verify'], 422);
        }

        $registration->update([
            'status' => 'verified',
            'verified_by' => $data['verified_by'],
            'verified_at' => now(),
        ]);

        return response()->json($registration);
    }

    public function approve(Request $request, CitizenRegistration $registration)
    {
        if (!in_array($registration->status, ['pending', 'verified'])) {
            return response()->json(['error' => 'Registration must be pending or verified to approve'], 422);
        }

        $registration->update([
            'status' => 'approved',
            'verified_at' => $registration->verified_at ?? now(),
            'verified_by' => $registration->verified_by ?? $request->input('approved_by'),
        ]);

        return response()->json($registration);
    }

    public function reject(Request $request, CitizenRegistration $registration)
    {
        $data = $request->validate([
            'reason' => 'required|string',
        ]);

        $registration->update(['status' => 'rejected']);
        return response()->json($registration);
    }

    public function stats()
    {
        return response()->json([
            'total_count' => CitizenRegistration::count(),
            'pending_count' => CitizenRegistration::where('status', 'pending')->count(),
            'verified_count' => CitizenRegistration::where('status', 'verified')->count(),
            'approved_count' => CitizenRegistration::where('status', 'approved')->count(),
            'rejected_count' => CitizenRegistration::where('status', 'rejected')->count(),
            'by_type' => CitizenRegistration::selectRaw('registration_type, count(*) as count')->groupBy('registration_type')->get(),
        ]);
    }
}
