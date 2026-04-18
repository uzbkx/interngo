"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

function DotMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  const routes = [
    { start: { x: 100, y: 150, delay: 0 },   end: { x: 200, y: 80,  delay: 2 } },
    { start: { x: 200, y: 80,  delay: 2 },   end: { x: 260, y: 120, delay: 4 } },
    { start: { x: 50,  y: 50,  delay: 1 },   end: { x: 150, y: 180, delay: 3 } },
    { start: { x: 280, y: 60,  delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 } },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ width, height });
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!dims.width || !dims.height) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = dims;
    const dots: { x: number; y: number; r: number; a: number }[] = [];
    const gap = 12;
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const inShape =
          (x < width * 0.25 && x > width * 0.05 && y < height * 0.4 && y > height * 0.1) ||
          (x < width * 0.25 && x > width * 0.15 && y < height * 0.8 && y > height * 0.4) ||
          (x < width * 0.45 && x > width * 0.3  && y < height * 0.35 && y > height * 0.15) ||
          (x < width * 0.5  && x > width * 0.35 && y < height * 0.65 && y > height * 0.35) ||
          (x < width * 0.7  && x > width * 0.45 && y < height * 0.5  && y > height * 0.1) ||
          (x < width * 0.8  && x > width * 0.65 && y < height * 0.8  && y > height * 0.6);
        if (inShape && Math.random() > 0.3) {
          dots.push({ x, y, r: 1, a: Math.random() * 0.5 + 0.1 });
        }
      }
    }

    let raf = 0;
    let start = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.a})`;
        ctx.fill();
      });

      const t = (Date.now() - start) / 1000;
      routes.forEach((r) => {
        const e = t - r.start.delay;
        if (e <= 0) return;
        const p = Math.min(e / 3, 1);
        const x = r.start.x + (r.end.x - r.start.x) * p;
        const y = r.start.y + (r.end.y - r.start.y) * p;
        ctx.beginPath();
        ctx.moveTo(r.start.x, r.start.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(r.start.x, r.start.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#60a5fa";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.3)";
        ctx.fill();
        if (p === 1) {
          ctx.beginPath();
          ctx.arc(r.end.x, r.end.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#3b82f6";
          ctx.fill();
        }
      });

      if (t > 15) start = Date.now();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [dims]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function AuthShell({
  title,
  subtitle,
  brandTitle = "InternGo",
  brandTagline,
  children,
}: {
  title: string;
  subtitle?: string;
  brandTitle?: string;
  brandTagline?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-card text-card-foreground shadow-2xl border border-border"
      >
        <div className="hidden md:block w-1/2 relative overflow-hidden border-r border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-950 dark:to-blue-950">
            <div className="relative w-full h-full">
              <DotMap />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6"
              >
                <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <GraduationCap className="text-white h-6 w-6" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-3xl font-bold mb-2 text-center text-white"
              >
                {brandTitle}
              </motion.h2>
              {brandTagline && (
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm text-center text-white/70 max-w-xs"
                >
                  {brandTagline}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-xl md:text-2xl font-bold mb-1">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>}
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
