import React from "react";
import { Globe, Lightbulb, Hexagon, Target } from "lucide-react";
import { AboutCell } from "./AboutCell";
import { About } from "@/lib/content";

interface AboutGridProps {
  about: About | null;
  isHero?: boolean;
}

export const AboutGrid: React.FC<AboutGridProps> = ({ about, isHero = false }) => {
  const data = [
    {
      icon: Globe,
      label: "ORIGIN",
      content: about?.bio || "I'm a freelance automation developer who works at the intersection of AI, workflow engineering, and frontend design.",
    },
    {
      icon: Lightbulb,
      label: "PHILOSOPHY",
      content: about?.philosophy || "Automation should feel invisible. The best systems are the ones that quietly do the work — no friction, no manual steps, just outcomes.",
    },
    {
      icon: Hexagon,
      label: "STACK",
      content: about?.stack || "My stack includes n8n, Python, Playwright, Claude/OpenAI APIs, Supabase, PostgreSQL, and HeroUI.",
    },
    {
      icon: Target,
      label: "CURRENT FOCUS",
      content: about?.current_focus || "Building an enterprise-grade portfolio platform with an Industrial Enterprise Architecture aesthetic.",
    },
  ];

  return (
    <div className={isHero ? "grid grid-cols-1 md:grid-cols-4 divide-x divide-white/5" : "flex flex-col"}>
      {data.map((item) => (
        <AboutCell
          key={item.label}
          icon={item.icon}
          label={item.label}
          content={item.content}
          isHero={isHero}
        />
      ))}
    </div>
  );
};


