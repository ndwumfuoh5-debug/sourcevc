"use client";

export function PitchFooter() {
  return (
    <footer id="footer" className="hero-gradient grid-pattern-dark py-16">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#D4A06A" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "#D4A06A" }}
              />
            </span>
            <span
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#F5E6D3" }}
            >
              Healthworx
            </span>
          </div>
          <p className="text-sm" style={{ color: "rgba(245,230,211,0.5)" }}>
            Backing the next generation of healthcare solutions.
          </p>
        </div>
        <p className="text-xs" style={{ color: "rgba(245,230,211,0.35)" }}>
          © 2025 Healthworx Capital · Nana Dwumfuoh
        </p>
      </div>
    </footer>
  );
}
