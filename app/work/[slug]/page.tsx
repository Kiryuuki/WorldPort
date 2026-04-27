import React from "react";
import { getCaseStudy, getCaseStudies } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const caseStudies = await getCaseStudies();
    return caseStudies.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch case studies for static params", error);
    return [];
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const post = await getCaseStudy(slug);

  if (!post) {
    notFound();
  }

  const stack = typeof post.stack === 'string' ? post.stack.split(',').map(s => s.trim()) : [];
  const readTime = "5 MIN READ"; // Mocked

  return (
    <article className="pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/work" 
          className="text-xs font-bold tracking-widest uppercase text-white/40 hover:text-accent transition-colors flex items-center gap-2 mb-12"
        >
          <span>←</span> Back to Work
        </Link>

        <header className="space-y-8 mb-20">
          <div className="flex flex-wrap gap-3">
            {stack.map((s: string) => (
              <span key={s} className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60">
                {s}
              </span>
            ))}
          </div>
          <h1 className="text-6xl font-bold tracking-tighter leading-tight">
            {post.title}
          </h1>
          <p className="text-2xl text-white/70 italic font-medium border-l-4 border-accent pl-8 py-2">
            "{post.hook}"
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-bold
          prose-ul:list-disc prose-li:text-white/70
          prose-hr:border-white/10
          space-y-12
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.body}
          </ReactMarkdown>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Written By</p>
            <p className="text-sm font-bold text-white">Aldrin Roxas</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Reading Time</p>
            <p className="text-sm font-bold text-white">{readTime}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Share Signal</p>
            <div className="flex gap-4 text-xs font-bold text-accent">
              <button className="hover:text-white transition-colors">Copy Link</button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
