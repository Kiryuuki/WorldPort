import React from "react";

export default function BlogPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Laboratory</span>
        <h1 className="text-5xl font-bold tracking-tighter">RAW THOUGHTS.</h1>
        <p className="text-xl text-white/55 italic">
          "The lab is currently being reorganized. New experiments, failures, and 
          raw thoughts are being transcribed from the void."
        </p>
        <div className="pt-12">
          <div className="inline-block px-6 py-2 glass rounded-full text-xs font-bold tracking-widest uppercase text-white/30">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
