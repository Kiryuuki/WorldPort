import React from "react";
import { getAbout } from "@/lib/content";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const AboutSection = async () => {
  let about: any = null;
  try {
    about = await getAbout();
  } catch (error) {
    console.error("AboutSection Error:", error);
    return null;
  }

  if (!about || (Array.isArray(about) && about.length === 0)) {
    return null;
  }

  return (
    <section className="reveal-text space-y-16 w-full">
      {/* WHO I AM */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Who I Am</span>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
        </div>
        <h2 className="text-3xl font-bold mt-2">ORIGIN</h2>
        <div className="prose prose-invert prose-p:text-white/70 prose-p:text-lg prose-p:leading-relaxed max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {about.whoiam_section || about.bio || "Data not available."}
          </ReactMarkdown>
        </div>
      </div>

      {/* PHILOSOPHY */}
      {about.philosophy && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">PHILOSOPHY</h2>
          <div className="prose prose-invert prose-p:text-white/70 prose-p:text-lg prose-p:leading-relaxed max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {about.philosophy}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* CURRENT FOCUS */}
      {about.current_focus && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">CURRENT FOCUS</h2>
          <div className="prose prose-invert prose-p:text-white/70 prose-p:text-lg prose-p:leading-relaxed max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {about.current_focus}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
};
