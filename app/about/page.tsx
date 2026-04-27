import React from "react";
import { getAbout, getCaseStudies } from "@/lib/content";
import { AboutContent } from "@/components/about/AboutContent";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [about, caseStudies] = await Promise.all([
    getAbout(),
    getCaseStudies()
  ]);

  return <AboutContent about={about} caseStudies={caseStudies} />;
}

