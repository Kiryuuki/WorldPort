import React from "react";
import { Zap, Database, Bot, Box, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const FooterPanel: React.FC = () => {
  return (
    <footer className="footer-panel glass rounded-[20px] p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg border border-accent/20">
          N
        </div>
        <p className="text-white/60 text-sm font-medium">
          Let's build something <br />
          <span className="text-white">automatic and impactful.</span>
        </p>
      </div>

      {/* Center section - Built With */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">
          BUILT WITH
        </span>
        <div className="flex items-center gap-6">
          <div className="group flex items-center gap-2" title="n8n">
            <Zap className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" />
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors hidden md:block">n8n</span>
          </div>
          <div className="group flex items-center gap-2" title="Supabase">
            <Database className="w-4 h-4 text-white/40 group-hover:text-[#3ECF8E] transition-colors" />
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors hidden md:block">Supabase</span>
          </div>
          <div className="group flex items-center gap-2" title="Claude API">
            <Bot className="w-4 h-4 text-white/40 group-hover:text-[#D97757] transition-colors" />
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors hidden md:block">Claude</span>
          </div>
          <div className="group flex items-center gap-2" title="Docker">
            <Box className="w-4 h-4 text-white/40 group-hover:text-[#2496ED] transition-colors" />
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors hidden md:block">Docker</span>
          </div>
        </div>
      </div>

      {/* Right section - Availability */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">
            AVAILABLE FOR PROJECTS
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] text-white/60 font-medium">Open to new opportunities</span>
          </div>
        </div>

        <Link
          href="/contact"
          className="bg-white text-black px-6 py-3 rounded-xl text-xs font-bold tracking-tight hover:bg-accent hover:text-white transition-all flex items-center gap-2"
        >
          GET IN TOUCH
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </footer>
  );
};
