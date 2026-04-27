// app/api/uptime/route.ts
// Proxy to Uptime Kuma public API (no auth needed — status page is public)
// Slug: glanstats | Base: http://192.168.100.144:3001
// Status: 1 = UP, 0 = DOWN (matches UptimeMonitor type from reference)
import { NextResponse } from 'next/server';

const UK_BASE = 'http://192.168.100.144:3001';
const SLUG    = 'glanstats';

export async function GET() {
  try {
    const [statusRes, hbRes] = await Promise.all([
      fetch(`${UK_BASE}/api/status-page/${SLUG}`,           { next: { revalidate: 30 } }),
      fetch(`${UK_BASE}/api/status-page/heartbeat/${SLUG}`, { next: { revalidate: 30 } }),
    ]);

    if (!statusRes.ok || !hbRes.ok) {
      throw new Error(`Uptime Kuma responded: ${statusRes.status} / ${hbRes.status}`);
    }

    const statusData = await statusRes.json();
    const hbData     = await hbRes.json();

    const hbList = hbData.heartbeatList || {};

    // Flatten publicGroupList → monitors, merge with latest heartbeat status
    const monitors = (statusData.publicGroupList || [])
      .flatMap((g: any) => g.monitorList || [])
      .map((m: any) => ({
        id:     String(m.id),
        name:   m.name,
        active: m.active,
        // status: 1=UP, 0=DOWN (matches reference types.ts UptimeMonitor)
        status: hbList[String(m.id)]?.at(-1)?.status ?? null,
        type:   m.type || 'HTTP',
      }));

    return NextResponse.json({
      monitors,
      slug: SLUG,
      last_updated: statusData.timestamp || new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[/api/uptime] Error:', err.message);
    return NextResponse.json({ monitors: [], slug: SLUG, last_updated: '', error: err.message }, { status: 500 });
  }
}
