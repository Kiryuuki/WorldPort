import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { StarCanvas } from "@/components/canvas/StarCanvas";
import { EarthCanvas } from "@/components/canvas/EarthCanvas";
import { AuroraCanvas } from "@/components/canvas/AuroraCanvas";
import { DustCanvas } from "@/components/canvas/DustCanvas";
import { VignetteCanvas } from "@/components/canvas/VignetteCanvas";
import { CursorCanvas } from "@/components/canvas/CursorCanvas";
import { GlassNav } from "@/components/nav/GlassNav";
import { LenisProvider } from "@/components/LenisProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "WorldPort | Aldrin Roxas",
  description: "One person, floating in space, building signal from noise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`}>
      <body className="bg-[#010611] text-foreground font-sans selection:bg-accent/30 overflow-x-hidden">
        <LenisProvider>
          {/* Background Layers */}
          <StarCanvas />
          
          {/* Additive Atmosphere Layers */}
          <div className="fixed inset-0 pointer-events-none mix-blend-plus-lighter">
            <AuroraCanvas />
            <DustCanvas />
          </div>

          <EarthCanvas />

          {/* UI & Overlays */}
          <VignetteCanvas />
          <CursorCanvas />
          <GlassNav />

          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
