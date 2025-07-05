import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/transactions";

// Get transaction by ID
export async function GET(req, { params }) {
    try {
        await connectDB();
        const transaction = await Transaction.findById(params.id);
        if (!transaction) {
            return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Update transaction by ID
export async function PUT(req, { params }) {
    try {
        await connectDB();
        const body = await req.json();
        const updated = await Transaction.findByIdAndUpdate(params.id, body, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, transaction: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
