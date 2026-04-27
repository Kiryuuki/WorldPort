import React from "react";
import { LucideIcon } from "lucide-react";

interface AboutInfoCardProps {
  icon: LucideIcon;
  label: string;
  content: string;
}

// Individual about card — matches the workflow feed styling from Image 2:
// dark glass bg, accent icon + label inline, monospace body text
// No hover interaction — purely informational
// — Dash
export const AboutInfoCard: React.FC<AboutInfoCardProps> = ({ icon: Icon, label, content }) => {
  return (
    <div
      style={{
        background: "rgba(10, 12, 28, 0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "20px 24px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Icon + Label row — matches workflow feed header pattern */}
      <div className="flex items-center gap-2 mb-3">
        <Icon
          size={16}
          style={{ color: "rgba(100,140,255,0.85)", flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(100,140,255,0.85)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Body text */}
      <p
        style={{
          fontSize: "13px",
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {content}
      </p>
    </div>
  );
};
