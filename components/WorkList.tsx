"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CharacterReveal } from "./ui/CharacterReveal";
import { UniverseCanvas } from "./canvas/UniverseCanvas";

interface Post {
  slug: string;
  title: string;
  stack: string[];
  hook: string;
  readTime: string;
}

export const WorkList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"grid" | "universe">("grid");

  useEffect(() => {
    if (view === "grid") {
      const ctx = gsap.context(() => {
        gsap.from(".work-header", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        gsap.from(".work-card", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [view]);

  return (
    <div ref={containerRef} className="pt-40 pb-20 px-6 min-h-screen" style={{ fontFamily: 'var(--font-mono)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 work-header flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-accent-label opacity-60">// PROOF_OF_WORK</span>
            <CharacterReveal 
              text="CASE STUDIES." 
              className="text-6xl font-bold mt-4 tracking-tighter text-white"
            />
            <p className="text-body-lg text-secondary mt-6 max-w-2xl">
              Real problems. Real solutions. Honest reflections. <br />
              Every project here is a story of how I build leverage.
            </p>
          </div>
          
          <div className="flex glass-panel p-1 rounded-full w-fit border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <button 
              onClick={() => setView("grid")}
              className={`px-6 py-2 rounded-full text-accent-label transition-all ${view === "grid" ? "bg-accent text-[#010611] opacity-100" : "text-white/40 hover:text-white"}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setView("universe")}
              className={`px-6 py-2 rounded-full text-accent-label transition-all ${view === "universe" ? "bg-accent text-[#010611] opacity-100" : "text-white/40 hover:text-white"}`}
            >
              Universe
            </button>
          </div>
        </header>

        {view === "grid" ? (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/case-studies/${post.slug}`}
                  className="group p-8 glass-panel space-y-6 hover:border-accent/30 transition-all duration-500 work-card border-white/5"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                      {post.stack.map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="text-meta">
                      {post.readTime}
                    </span>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-white group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-body text-secondary mt-4 leading-relaxed line-clamp-2">
                      {post.hook}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-2 text-label group-hover:gap-4 transition-all text-accent">
                    Read Case Study <span>→</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 p-20 glass-panel text-center space-y-4 border-white/5">
                <p className="text-accent-label opacity-30">No case studies yet.</p>
                <p className="text-body text-secondary italic">"The best work is currently being built in the void."</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[60vh] w-full glass-panel overflow-hidden border-white/5">
            <UniverseCanvas projects={posts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkList;
