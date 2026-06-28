import { NextResponse } from 'next/server';
import { getRecords, clearRecords } from '@/lib/recordsDb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let records = await getRecords();

    if (status) {
      records = records.filter(r => r.status === status);
    }

    return NextResponse.json({
      success: true,
      records
    });
  } catch (error) {
    console.error('Fetch records error:', error);
    return NextResponse.json({ error: 'Failed to fetch records', details: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearRecords();
    return NextResponse.json({
      success: true,
      message: 'All records cleared'
    });
  } catch (error) {
    console.error('Clear records error:', error);
    return NextResponse.json({ error: 'Failed to clear records', details: error.message }, { status: 500 });
  }
}
