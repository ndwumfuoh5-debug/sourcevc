"use client";

import { Linkedin, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer
      className="py-14 px-6 md:px-10"
      style={{
        background: "rgba(20,25,40,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/10 pb-10 mb-8">
          {/* Right: icon links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
            >
              <Linkedin size={15} />
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:hello@example.com"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
            >
              <Mail size={15} />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} · All submissions are confidential
        </p>
      </div>
    </footer>
  );
}
