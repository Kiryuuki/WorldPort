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
    <div className={`group ${isHero ? 'p-8' : 'p-5 border-b border-white/5 last:border-b-0'} hover:bg-white/[0.01] transition-all duration-300`} style={{ fontFamily: 'var(--font-mono)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-accent/50 group-hover:text-accent transition-colors" />
        <span className="text-accent-label opacity-40 group-hover:opacity-70 transition-opacity">
          {label}
        </span>
      </div>
      <p className={`text-meta text-secondary leading-relaxed ${isHero ? 'text-[12px]' : 'text-[11px]'}`}>
        {content}
      </p>
    </div>
  );
};


