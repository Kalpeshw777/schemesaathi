"use client";

import { useEffect, useRef } from "react";

export interface DotGridProps {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export default function DotGrid({
  dotColor = "#334155",
  dotSize = 1.25,
  spacing = 26,
  interactive = false,
  opacity = 0.35,
  className = "",
}: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      if (!interactive) {
        drawStatic();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing;
          const y = offsetY + j * spacing;

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawInteractive = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;
      const mouse = mouseRef.current;
      const maxDistance = 140;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing;
          const y = offsetY + j * spacing;

          let currentSize = dotSize;

          if (mouse.active) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const factor = 1 - dist / maxDistance;
              currentSize = dotSize + factor * 2.5;
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animIdRef.current = requestAnimationFrame(drawInteractive);
    };

    resize();
    window.addEventListener("resize", resize);

    if (interactive) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      };

      const handleMouseLeave = () => {
        mouseRef.current.active = false;
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      animIdRef.current = requestAnimationFrame(drawInteractive);

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      };
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [dotColor, dotSize, spacing, interactive]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`.trim()}
      style={{ opacity }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
