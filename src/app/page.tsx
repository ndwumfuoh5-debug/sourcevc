"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { SubmitSection } from "@/components/landing/SubmitSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <main>
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <SubmitSection />
      <LandingFooter />
    </main>
  );
}
