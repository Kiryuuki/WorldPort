import React from "react";
import { getSortedPostsData } from "@/lib/posts";
import { WorkList } from "@/components/WorkList";

export default function WorkPage() {
  const posts = getSortedPostsData();
  return <WorkList posts={posts} />;
}
