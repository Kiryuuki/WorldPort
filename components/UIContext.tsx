"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isContactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  activeCaseStudySlug: string | null;
  setActiveCaseStudySlug: (slug: string | null) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContactOpen, setContactOpen] = useState(false);
  const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(null);

  return (
    <UIContext.Provider value={{ isContactOpen, setContactOpen, activeCaseStudySlug, setActiveCaseStudySlug }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
