import { NextResponse } from "next/server";
import { getRecords, clearRecords } from "@/lib/utils/db";

export async function GET() {
  try {
    const records = await getRecords();
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearRecords();
    return NextResponse.json({ success: true, message: "All records cleared" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
