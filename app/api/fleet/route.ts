import { getGlanceStatus } from '@/lib/glance';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getGlanceStatus();
  return NextResponse.json(data);
}
