import React from "react";
import { LucideIcon } from "lucide-react";

interface AboutCellProps {
  icon: LucideIcon;
  label: string;
  content: string;
  isHero?: boolean;
}

export const AboutCell: React.FC<AboutCellProps> = ({ icon: Icon, label, content, isHero = false }) => {
  return (
    <div className={`group ${isHero ? 'p-8' : 'p-5 border-b border-white/5 last:border-b-0'} hover:bg-white/[0.01] transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-accent/50 group-hover:text-accent transition-colors" />
        <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/30 group-hover:text-white/60 transition-colors">
          {label}
        </span>
      </div>
      <p className={`text-white/50 leading-relaxed font-mono ${isHero ? 'text-[12px]' : 'text-[11px]'}`}>
        {content}
      </p>
    </div>
  );
};


