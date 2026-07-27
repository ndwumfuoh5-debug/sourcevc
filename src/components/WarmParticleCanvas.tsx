"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
  column: number;
}

export function WarmParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const GRID_SIZE = 60;
    const PARTICLE_COUNT = 40;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function spawnParticle(forceColumn?: number): Particle {
      if (!canvas) {
        return { x: 0, y: 0, speed: 0.4, opacity: 0, size: 1.5, column: 0 };
      }
      const cols = Math.floor(canvas.width / GRID_SIZE);
      const col = forceColumn !== undefined ? forceColumn : Math.floor(Math.random() * cols);
      return {
        x: col * GRID_SIZE + GRID_SIZE / 2,
        y: canvas.height + Math.random() * 200,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0,
        size: 1 + Math.random() * 1.5,
        column: col,
      };
    }

    function initParticles() {
      if (!canvas) return;
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = spawnParticle();
        // Distribute vertically on init
        p.y = Math.random() * canvas.height;
        p.opacity = Math.random() * 0.6;
        particles.push(p);
      }
    }

    function drawGrid() {
      if (!canvas || !ctx) return;
      ctx.strokeStyle = "rgba(210,160,100,0.05)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        p.y -= p.speed;

        // Fade in near bottom, fade out near top
        const progress = 1 - p.y / canvas.height;
        if (progress < 0.15) {
          p.opacity = Math.min(p.opacity + 0.015, (progress / 0.15) * 0.7);
        } else if (progress > 0.75) {
          p.opacity = Math.max(0, p.opacity - 0.012);
        } else {
          p.opacity = Math.min(p.opacity + 0.01, 0.7);
        }

        if (p.y < -10 || p.opacity <= 0) {
          particles[i] = spawnParticle(p.column);
        } else {
          // Draw glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          gradient.addColorStop(0, `rgba(210,160,100,${p.opacity})`);
          gradient.addColorStop(1, `rgba(210,160,100,0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Draw core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,175,120,${p.opacity})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
