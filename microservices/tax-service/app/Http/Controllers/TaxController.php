<?php

namespace App\Http\Controllers;

use App\Models\TaxRecord;
use Illuminate\Http\Request;

class TaxController extends Controller
{
    public function index(Request $request)
    {
        $query = TaxRecord::query();
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('taxpayer_name', 'like', "%{$request->search}%")
                  ->orWhere('tax_number', 'like', "%{$request->search}%")
                  ->orWhere('taxpayer_id', 'like', "%{$request->search}%");
            });
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->tax_type) {
            $query->where('tax_type', $request->tax_type);
        }
        if ($request->financial_year) {
            $query->where('financial_year', $request->financial_year);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|integer',
            'taxpayer_name' => 'required|string',
            'taxpayer_id' => 'required|string',
            'tax_type' => 'required|in:income,property,business,vat,customs',
            'amount_due' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'financial_year' => 'required|string',
            'notes' => 'nullable|string',
        ]);
        $data['tax_number'] = 'TAX-' . date('Y') . '-' . str_pad(TaxRecord::count() + 1, 4, '0', STR_PAD_LEFT);
        $data['status'] = 'pending';
        $data['amount_paid'] = 0;
        return response()->json(TaxRecord::create($data), 201);
    }

    public function show(TaxRecord $tax)
    {
        return response()->json($tax);
    }

    public function update(Request $request, TaxRecord $tax)
    {
        $data = $request->validate([
            'taxpayer_name' => 'sometimes|string',
            'tax_type' => 'sometimes|in:income,property,business,vat,customs',
            'amount_due' => 'sometimes|numeric|min:0',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,paid,overdue,partial',
            'notes' => 'nullable|string',
            'financial_year' => 'sometimes|string',
        ]);
        $tax->update($data);
        return response()->json($tax);
    }

    public function pay(Request $request, TaxRecord $tax)
    {
        $validated = $request->validate(['amount' => 'required|numeric|min:0.01']);
        $amount = $validated['amount'];
        $tax->amount_paid = min($tax->amount_due, $tax->amount_paid + $amount);
        $tax->payment_date = now();
        $tax->status = $tax->amount_paid >= $tax->amount_due ? 'paid' : 'partial';
        $tax->save();
        return response()->json($tax);
    }

    public function stats()
    {
        return response()->json([
            'total_collected' => (float) TaxRecord::sum('amount_paid'),
            'total_due' => (float) TaxRecord::sum('amount_due'),
            'pending_count' => TaxRecord::whereIn('status', ['pending', 'overdue', 'partial'])->count(),
            'paid_count' => TaxRecord::where('status', 'paid')->count(),
            'overdue_count' => TaxRecord::where('status', 'overdue')->count(),
            'total_count' => TaxRecord::count(),
        ]);
    }
}
