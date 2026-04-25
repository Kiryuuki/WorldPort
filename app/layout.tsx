import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { StarCanvas } from "@/components/canvas/StarCanvas";
import { CursorCanvas } from "@/components/canvas/CursorCanvas";
import { EarthCanvas } from "@/components/canvas/EarthCanvas";
import { GlassNav } from "@/components/nav/GlassNav";
import { PageTransition } from "@/components/PageTransition";
import { FloatingPills } from "@/components/ui/FloatingPills";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
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
      <body className="bg-background text-foreground font-sans">
        <LenisProvider>
          <StarCanvas />
          <EarthCanvas />
          <CursorCanvas />
          <GlassNav />
          <FloatingPills />
          <main className="relative" style={{ zIndex: 10 }}>
            <PageTransition>{children}</PageTransition>
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
