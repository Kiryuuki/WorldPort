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
    <article className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center" style={{ fontFamily: 'var(--font-mono)' }}>
      <div className="max-w-4xl w-full p-8 md:p-16 glass-panel rounded-[40px] relative overflow-hidden border-white/10">
        <Link 
          href="/case-studies" 
          className="text-accent-label text-secondary hover:text-accent transition-colors flex items-center gap-2 mb-12"
        >
          <span>←</span> BACK_TO_CASE_STUDIES
        </Link>

        <header className="space-y-8 mb-20">
          <div className="flex flex-wrap gap-3">
            {stack.map((s: string) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight text-white uppercase">
            {post.title}
          </h1>
          <div className="h-[1px] w-24 bg-accent/50 mb-8" />
          <p className="text-xl md:text-2xl text-secondary italic font-medium leading-relaxed">
            "{post.hook}"
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-headings:uppercase
          prose-p:text-secondary prose-p:leading-relaxed prose-p:text-body-lg
          prose-strong:text-white prose-strong:font-bold
          prose-ul:list-disc prose-li:text-secondary
          prose-hr:border-white/10
          space-y-12
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.body}
          </ReactMarkdown>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-2">
            <p className="text-accent-label opacity-30">WRITTEN_BY</p>
            <p className="text-sm font-bold text-white uppercase">Aldrin Roxas</p>
          </div>
          <div className="space-y-2">
            <p className="text-accent-label opacity-30">READING_TIME</p>
            <p className="text-sm font-bold text-white uppercase">{readTime}</p>
          </div>
          <div className="space-y-2">
            <p className="text-accent-label opacity-30">SHARE_SIGNAL</p>
            <div className="flex gap-4 text-accent-label text-accent">
              <button className="hover:text-white transition-colors">COPY_LINK</button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
