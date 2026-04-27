// app/api/executions/route.ts
// Server-side Supabase fetch — uses service role key, never exposed to browser
// Table: n8n_execution_logs (confirmed from production)
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Lazy init — server only
const getClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page      = parseInt(searchParams.get('page')      || '1');
  const page_size = parseInt(searchParams.get('page_size') || '20');
  const status    = searchParams.get('status');
  const name      = searchParams.get('workflow_name');

  // Exclude execution_data (large JSON blob) from list view — fetched per-row via /[id]
  const cols = [
    'id','execution_id','workflow_id','workflow_name','status',
    'finished','started_at','finished_at','duration_ms','mode',
    'node_count','error_message','created_at','workflow_data'
  ].join(',');

  const supabase = getClient();
  let q = supabase
    .from('n8n_execution_logs')
    .select(cols, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * page_size, page * page_size - 1);

  if (status && status !== 'all') q = q.eq('status', status);
  if (name) q = q.ilike('workflow_name', `%${name}%`);

  const { data, count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Global stats for header badges
  const [totalRes, successRes, errorRes] = await Promise.all([
    supabase.from('n8n_execution_logs').select('id', { count: 'exact', head: true }),
    supabase.from('n8n_execution_logs').select('id', { count: 'exact', head: true }).eq('status', 'success'),
    supabase.from('n8n_execution_logs').select('id', { count: 'exact', head: true }).in('status', ['error', 'failed']),
  ]);

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    page_size,
    pages: Math.ceil((count || 0) / page_size),
    global_stats: {
      total:   totalRes.count   || 0,
      success: successRes.count || 0,
      error:   errorRes.count   || 0,
    },
  });
}
