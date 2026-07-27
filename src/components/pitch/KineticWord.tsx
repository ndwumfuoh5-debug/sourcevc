"use client";

import { useEffect, useState } from "react";

const CYCLING_WORDS = ["Healthcare.", "Founders.", "Solutions."];

export function KineticWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % CYCLING_WORDS.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        color: "#D4A06A",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        display: "inline-block",
      }}
    >
      {CYCLING_WORDS[index]}
    </span>
  );
}
