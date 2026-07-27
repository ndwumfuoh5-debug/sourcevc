"use client";

export function PitchFooter() {
  return (
    <footer
      id="footer"
      className="py-10 border-t"
      style={{
        background: "#FDFAF7",
        borderColor: "rgba(139,69,19,0.08)",
      }}
    >
      <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
        <span className="text-xs" style={{ color: "rgba(92,45,18,0.35)" }}>
          All submissions are reviewed personally.
        </span>
        <span className="text-xs" style={{ color: "rgba(92,45,18,0.25)" }}>
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
