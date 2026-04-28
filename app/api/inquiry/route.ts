// app/api/inquiry/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const payload = {
      name:           body.name,
      email:          body.email,
      company:        body.company        || null,
      budget:         body.budget         || null,
      timeline:       body.timeline       || null,
      project_type:   body.project_type   || null,
      project_details:body.project_details|| null,
      submitted_at:   new Date().toISOString(),
      source:         'worldport-contact',
    };

    const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET!,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('n8n webhook failed:', res.status, await res.text());
      return NextResponse.json(
        { error: 'Failed to send inquiry' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inquiry API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
