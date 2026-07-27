"use client";

import { Linkedin, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0D1117] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 items-center mb-12">
          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-[#14532D] rounded flex items-center justify-center text-white text-sm font-bold">
              N
            </span>
            <div>
              <p className="text-white font-semibold text-sm">NDC</p>
              <p className="text-gray-500 text-xs">Healthcare Ventures</p>
            </div>
          </div>

          {/* Center: tagline */}
          <p className="text-gray-400 text-sm text-center text-pretty">
            Built for founders who are changing healthcare.
          </p>

          {/* Right: links */}
          <div className="flex items-center gap-4 md:justify-end">
            <a
              href="#"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
            <a
              href="mailto:hello@example.com"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <Mail size={15} />
              Email
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-gray-600 text-xs">
            © 2026 · All submissions are confidential
          </p>
        </div>
      </div>
    </footer>
  );
}
