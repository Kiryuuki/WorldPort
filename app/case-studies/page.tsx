import React from "react";
import { getCaseStudies } from "@/lib/content";
import { WorkList } from "@/components/WorkList";

export const revalidate = 3600;

export default async function WorkPage() {
  const caseStudies = await getCaseStudies();
  const posts = caseStudies.map((cs: any) => ({
    slug: cs.slug,
    title: cs.title,
    stack: cs.stack || "",
    hook: cs.hook,
    readTime: "5 MIN READ", // Mocked for now, can be computed from body length later
  }));
  return <WorkList posts={posts} />;
}
