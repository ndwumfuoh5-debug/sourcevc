"use client";

import { HeroSection } from "@/components/pitch/HeroSection";
import { PitchFooter } from "@/components/pitch/PitchFooter";
import { PitchFormSection } from "@/components/pitch/PitchFormSection";
import { PitchNavbar } from "@/components/pitch/PitchNavbar";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SubmitPitchPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFAF7" }}>
      <PitchNavbar onApplyClick={() => scrollTo("apply")} />
      <HeroSection onApplyClick={() => scrollTo("apply")} />
      <PitchFormSection />
      <PitchFooter />
    </div>
  );
}
