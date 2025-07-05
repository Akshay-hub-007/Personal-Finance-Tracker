import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Budget from "@/models/budget";

export async function GET(req, context) {
  const { params } = await context;
  try {
    await connectDB();
    const budget = await Budget.findById(params.id);
    if (!budget) {
      return NextResponse.json({ success: false, error: "Budget not found" }, { status: 404 });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const { params } = await context;
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Budget.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Budget not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, budget: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { params } = await context;
  try {
    await connectDB();
    const deleted = await Budget.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Budget not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Budget deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
