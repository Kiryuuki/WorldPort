import React from "react";

export default function ContactPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-12 text-center">
        <header className="space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Get in Touch</span>
          <h1 className="text-5xl font-bold tracking-tighter">LET'S BUILD SIGNAL.</h1>
        </header>

        <p className="text-xl text-white/55 leading-relaxed">
          I'm currently open to new projects that require leverage, automation, 
          and clear-eyed thinking.
        </p>

        <div className="space-y-6 pt-12">
          <a 
            href="mailto:aldrin@example.com" 
            className="text-3xl font-medium text-white hover:text-accent transition-colors underline underline-offset-8 decoration-white/10"
          >
            aldrin@worldport.dev
          </a>
          
          <div className="flex justify-center gap-8 text-sm font-bold tracking-widest uppercase text-white/40 pt-8">
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com" className="hover:text-white transition-colors">X / Twitter</a>
          </div>
        </div>

        <div className="pt-20 opacity-30">
          <p className="text-[10px] uppercase tracking-[0.2em]">Pasig City, PH • 14.5750° N, 121.0561° E</p>
        </div>
      </div>
    </div>
  );
}
