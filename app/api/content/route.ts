import { NextResponse } from 'next/server';
import { getCaseStudies, getAbout } from '@/lib/content';

export async function GET() {
  try {
    const [caseStudies, about] = await Promise.all([
      getCaseStudies(),
      getAbout()
    ]);
    
    return NextResponse.json({ caseStudies, about });
  } catch (error) {
    console.error("API Content Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
