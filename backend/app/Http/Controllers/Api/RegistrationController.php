<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CitizenRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = CitizenRegistration::with('verifier');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('registration_type')) {
            $query->where('registration_type', $request->registration_type);
        }
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('national_id', 'like', "%{$search}%")
                  ->orWhere('registration_number', 'like', "%{$search}%");
            });
        }

        $registrations = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($registrations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'              => 'required|string|max:100',
            'last_name'               => 'required|string|max:100',
            'date_of_birth'           => 'required|date|before:today',
            'gender'                  => 'required|in:male,female,other',
            'national_id'             => 'required|string|max:50|unique:citizen_registrations',
            'passport_number'         => 'nullable|string|max:50',
            'nationality'             => 'required|string|max:100',
            'marital_status'          => 'required|in:single,married,divorced,widowed',
            'address'                 => 'required|string|max:500',
            'city'                    => 'required|string|max:100',
            'region'                  => 'required|string|max:100',
            'phone'                   => 'required|string|max:20',
            'email'                   => 'nullable|email|max:255',
            'emergency_contact_name'  => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'registration_type'       => 'required|in:birth,death,marriage,divorce,citizenship',
        ]);

        $validated['registration_number'] = 'REG-' . strtoupper(Str::random(10));
        $validated['status']              = 'pending';

        $registration = CitizenRegistration::create($validated);

        return response()->json([
            'message' => 'Registration submitted successfully',
            'data'    => $registration->load('verifier'),
        ], 201);
    }

    public function show(CitizenRegistration $registration)
    {
        return response()->json(['data' => $registration->load('verifier')]);
    }

    public function update(Request $request, CitizenRegistration $registration)
    {
        $validated = $request->validate([
            'first_name'              => 'sometimes|string|max:100',
            'last_name'               => 'sometimes|string|max:100',
            'date_of_birth'           => 'sometimes|date',
            'gender'                  => 'sometimes|in:male,female,other',
            'passport_number'         => 'nullable|string|max:50',
            'nationality'             => 'sometimes|string|max:100',
            'marital_status'          => 'sometimes|in:single,married,divorced,widowed',
            'address'                 => 'sometimes|string|max:500',
            'city'                    => 'sometimes|string|max:100',
            'region'                  => 'sometimes|string|max:100',
            'phone'                   => 'sometimes|string|max:20',
            'email'                   => 'nullable|email|max:255',
            'emergency_contact_name'  => 'sometimes|string|max:255',
            'emergency_contact_phone' => 'sometimes|string|max:20',
            'registration_type'       => 'sometimes|in:birth,death,marriage,divorce,citizenship',
            'status'                  => 'sometimes|in:pending,verified,approved,rejected',
        ]);

        $registration->update($validated);

        return response()->json([
            'message' => 'Registration updated successfully',
            'data'    => $registration->fresh()->load('verifier'),
        ]);
    }

    public function verify(Request $request, CitizenRegistration $registration)
    {
        $registration->update([
            'status'      => 'verified',
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Registration verified successfully',
            'data'    => $registration->fresh()->load('verifier'),
        ]);
    }

    public function approve(Request $request, CitizenRegistration $registration)
    {
        if ($registration->status !== 'verified') {
            return response()->json(['message' => 'Registration must be verified before approval'], 422);
        }

        $registration->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Registration approved successfully',
            'data'    => $registration->fresh()->load('verifier'),
        ]);
    }

    public function destroy(CitizenRegistration $registration)
    {
        $registration->delete();
        return response()->json(['message' => 'Registration deleted successfully']);
    }
}
