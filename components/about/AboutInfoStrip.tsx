import React from "react";
import { LucideIcon } from "lucide-react";
import { AboutInfoCard } from "./AboutInfoCard";

interface CardData {
  icon: LucideIcon;
  label: string;
  content: string;
}

interface AboutInfoStripProps {
  cards: CardData[];
}

// Full-width 4-card horizontal strip — sits at the bottom of the hero viewport
// Styled from the workflow feed panel (Image 2): dark glass, mono font, accent labels
// — Dash
export const AboutInfoStrip: React.FC<AboutInfoStripProps> = ({ cards }) => {
  return (
    // Horizontal rule above the strip
    <div className="w-full">
      <div
        className="w-full mb-4"
        style={{ height: "1px", background: "var(--border-row)" }}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
        {cards.map((card) => (
          <div key={card.label} className="h-full">
            <AboutInfoCard
              icon={card.icon}
              label={card.label}
              content={card.content}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
