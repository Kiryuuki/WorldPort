import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutInfoCardProps {
  icon: LucideIcon;
  label: string;
  content: string;
}

export const AboutInfoCard: React.FC<AboutInfoCardProps> = ({ icon: Icon, label, content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: "relative", height: "140px", width: "100%" }}>
      <motion.div
        className="glass-panel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{
          height: isHovered ? "auto" : "140px",
          scale: isHovered ? 1.02 : 1,
          borderColor: isHovered ? "rgba(100, 128, 255, 0.4)" : "rgba(255, 255, 255, 0.05)",
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          cursor: "default",
          zIndex: isHovered ? 50 : 1,
          position: isHovered ? "absolute" : "relative",
          bottom: 0,
          left: 0,
          right: 0,
          background: isHovered ? "rgba(8, 10, 20, 0.98)" : "rgba(8, 10, 20, 0.8)",
          boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(100,128,255,0.15)" : "none",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon
            size={16}
            style={{ 
              color: isHovered ? "var(--accent)" : "rgba(255,255,255,0.4)", 
              transition: "color 0.2s" 
            }}
          />
          <span className={`text-accent-label transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
            {label}
          </span>
        </div>

        <p
          className="text-body transition-all duration-300"
          style={{
            color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
            display: "-webkit-box",
            WebkitLineClamp: isHovered ? "unset" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "11px",
            lineHeight: "1.6",
            fontFamily: "var(--font-mono)",
          }}
        >
          {content}
        </p>
      </motion.div>
    </div>
  );
};
