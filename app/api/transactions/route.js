import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/transactions";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const transaction = await Transaction.create(body);
    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
