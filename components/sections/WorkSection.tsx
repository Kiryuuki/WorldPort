import React from "react";
import Link from "next/link";
import { getCaseStudies } from "@/lib/content";

export const WorkSection = async () => {
  let caseStudies: any[] = [];
  try {
    caseStudies = await getCaseStudies();
  } catch (error) {
    console.error("WorkSection Error:", error);
    return (
      <section className="reveal-text space-y-8 w-full">
        <h2 className="text-4xl font-bold mt-2">I BUILD LEVERAGE.</h2>
        <p className="text-white/40 italic">Case studies are currently drifting in space (Connection error).</p>
      </section>
    );
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <section className="reveal-text space-y-8 w-full">
        <h2 className="text-4xl font-bold mt-2">I BUILD LEVERAGE.</h2>
        <p className="text-white/40 italic">No case studies found. Building signal from noise...</p>
      </section>
    );
  }

  return (
    <section className="reveal-text space-y-8 w-full">
      <div className="flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Case Studies</span>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-accent/50 to-transparent"></div>
      </div>
      
      <h2 className="text-4xl font-bold mt-2">I BUILD LEVERAGE.</h2>
      
      <div className="grid gap-6 mt-8">
        {caseStudies.map((cs: any) => (
          <Link 
            key={cs.id} 
            href={`/work/${cs.slug}`}
            className="group block p-6 glass rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{cs.title}</h3>
                <span className="text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors">
                  Read
                </span>
              </div>
              
              <p className="text-white/60 font-medium leading-relaxed">
                {cs.hook}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {cs.stack?.split(',').map((tool: string) => (
                  <span key={tool.trim()} className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-white/5 rounded-full text-white/50 border border-white/5 group-hover:border-white/10">
                    {tool.trim()}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
