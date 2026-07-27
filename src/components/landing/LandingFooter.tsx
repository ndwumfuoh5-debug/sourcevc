"use client";

import { Linkedin, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-black py-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b border-white/10 pb-12 mb-10">
          {/* Left: wordmark */}
          <p className="text-white font-black text-3xl tracking-[-0.03em] lowercase">
            ndc · healthcare ventures
          </p>

          {/* Right: links */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <Linkedin size={14} />
              <span className="text-xs tracking-widest uppercase">LinkedIn</span>
            </a>
            <a
              href="mailto:hello@example.com"
              className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <Mail size={14} />
              <span className="text-xs tracking-widest uppercase">Email</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/20 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} · All submissions are confidential
          </p>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Built for founders changing healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
