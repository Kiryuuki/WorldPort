"use client";

import React from "react";
import { canvasSettings } from "@/lib/canvas-settings";

// VignetteCanvas — Phase 8: Cinematic Vignette
// Simple overlay to provide deep space framing.
// — Dash

export const VignetteCanvas: React.FC = () => {
  const { height, opacity, color } = canvasSettings.vignette;

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        background: `linear-gradient(to top, rgba(${color}, ${opacity}) 0%, transparent ${height})`,
        zIndex: 100,
      }}
    />
  );
};

export default VignetteCanvas;
