// app/api/executions/[id]/route.ts
// Fetch single execution WITH full execution_data for the step graph
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const getClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getClient();

  const { data, error } = await supabase
    .from('n8n_execution_logs')
    .select('*') // full row including execution_data
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
