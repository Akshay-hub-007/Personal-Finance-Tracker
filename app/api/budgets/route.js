import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Budget from "@/models/budget";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(body)
    const budget = await Budget.create(body);
    return NextResponse.json({ success: true, budget });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, budgets });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
