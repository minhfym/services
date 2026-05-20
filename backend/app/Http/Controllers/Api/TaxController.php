<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaxRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TaxController extends Controller
{
    public function index(Request $request)
    {
        $query = TaxRecord::with('user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('tax_type')) {
            $query->where('tax_type', $request->tax_type);
        }
        if ($request->filled('financial_year')) {
            $query->where('financial_year', $request->financial_year);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('taxpayer_name', 'like', "%{$search}%")
                  ->orWhere('tax_number', 'like', "%{$search}%")
                  ->orWhere('taxpayer_id', 'like', "%{$search}%");
            });
        }

        // Non-admins only see their own records
        if ($request->user()->role === 'citizen') {
            $query->where('user_id', $request->user()->id);
        }

        $records = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'taxpayer_name'  => 'required|string|max:255',
            'taxpayer_id'    => 'required|string|max:100',
            'tax_type'       => 'required|in:income,property,business,vat,customs',
            'amount_due'     => 'required|numeric|min:0',
            'amount_paid'    => 'nullable|numeric|min:0',
            'due_date'       => 'required|date',
            'payment_date'   => 'nullable|date',
            'status'         => 'nullable|in:pending,paid,overdue,partial',
            'financial_year' => 'required|string|max:20',
            'notes'          => 'nullable|string',
        ]);

        $validated['tax_number'] = 'TAX-' . strtoupper(Str::random(8));
        $validated['amount_paid'] = $validated['amount_paid'] ?? 0;
        $validated['status'] = $validated['status'] ?? 'pending';

        $tax = TaxRecord::create($validated);

        return response()->json([
            'message' => 'Tax record created successfully',
            'data'    => $tax->load('user'),
        ], 201);
    }

    public function show(Request $request, TaxRecord $tax)
    {
        if ($request->user()->role === 'citizen' && $tax->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['data' => $tax->load('user')]);
    }

    public function update(Request $request, TaxRecord $tax)
    {
        $validated = $request->validate([
            'taxpayer_name'  => 'sometimes|string|max:255',
            'taxpayer_id'    => 'sometimes|string|max:100',
            'tax_type'       => 'sometimes|in:income,property,business,vat,customs',
            'amount_due'     => 'sometimes|numeric|min:0',
            'amount_paid'    => 'sometimes|numeric|min:0',
            'due_date'       => 'sometimes|date',
            'payment_date'   => 'nullable|date',
            'status'         => 'sometimes|in:pending,paid,overdue,partial',
            'financial_year' => 'sometimes|string|max:20',
            'notes'          => 'nullable|string',
        ]);

        $tax->update($validated);

        return response()->json([
            'message' => 'Tax record updated successfully',
            'data'    => $tax->fresh()->load('user'),
        ]);
    }

    public function pay(Request $request, TaxRecord $tax)
    {
        $validated = $request->validate([
            'amount'       => 'required|numeric|min:0.01',
            'payment_date' => 'nullable|date',
        ]);

        $amount       = $validated['amount'];
        $paymentDate  = $validated['payment_date'] ?? now()->toDateString();
        $newAmountPaid = $tax->amount_paid + $amount;

        $status = 'partial';
        if ($newAmountPaid >= $tax->amount_due) {
            $status      = 'paid';
            $newAmountPaid = $tax->amount_due; // Cap at amount due
        }

        $tax->update([
            'amount_paid'  => $newAmountPaid,
            'payment_date' => $paymentDate,
            'status'       => $status,
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'data'    => $tax->fresh()->load('user'),
        ]);
    }

    public function destroy(TaxRecord $tax)
    {
        $tax->delete();
        return response()->json(['message' => 'Tax record deleted successfully']);
    }
}
