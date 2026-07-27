"use client";

import { AboutSection } from "@/components/pitch/AboutSection";
import { HeroSection } from "@/components/pitch/HeroSection";
import { PitchFooter } from "@/components/pitch/PitchFooter";
import { PitchFormSection } from "@/components/pitch/PitchFormSection";
import { PitchNavbar } from "@/components/pitch/PitchNavbar";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SubmitPitchPage() {
  return (
    <div className="min-h-screen bg-white">
      <PitchNavbar onApplyClick={() => scrollTo("apply")} />
      <HeroSection
        onApplyClick={() => scrollTo("apply")}
        onLearnMoreClick={() => scrollTo("about")}
      />
      <AboutSection />
      <PitchFormSection />
      <PitchFooter />
    </div>
  );
}
