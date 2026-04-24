"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export function WorldMap({ dots = [], lineColor = "#4f46e5" }: MapProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const svgRef = useRef<SVGSVGElement>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const mapWidth = (map as unknown as { width: number }).width;
  const mapHeight = (map as unknown as { height: number }).height;

  const svgMap = useMemo(
    () => map.getSVG({
      radius: 0.22,
      color: isDark ? "#FFFFFF90" : "#000000",
      shape: "circle",
      backgroundColor: "transparent",
    }),
    [map, isDark]
  );

  const projectPoint = (lat: number, lng: number) => {
    const pin = (map as unknown as {
      getPin: (args: { lat: number; lng: number }) => { x: number; y: number } | undefined;
    }).getPin({ lat, lng });
    if (pin) return { x: pin.x, y: pin.y };
    // fallback to mercator if getPin fails (edge of map)
    const x = ((lng + 180) / 360) * mapWidth;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = mapHeight / 2 - (mapWidth / (2 * Math.PI)) * mercN;
    return { x, y };
  };

  const scale = mapHeight / 400;
  const r1 = 2 * scale;
  const r2 = 3 * scale;
  const r3 = 8 * scale;
  const strokeW = Math.max(0.3, 1 * scale);
  const arcLift = 50 * scale;

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - arcLift;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const staggerDelay = 0.3;
  const animationDuration = 2;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const fullCycleDuration = totalAnimationTime + 2;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center opacity-80">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="w-full h-full object-contain [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
          alt=""
          height={mapHeight}
          width={mapWidth}
          draggable={false}
          priority
        />
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="absolute inset-0 w-full h-full opacity-60"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="hero-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#hero-path-gradient)"
                strokeWidth={strokeW}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 0, 1, 1, 0] }}
                transition={{
                  duration: fullCycleDuration,
                  times: [0, startTime, endTime, resetTime, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
              <motion.circle
                r={r2}
                fill={lineColor}
                initial={{ offsetDistance: "0%", opacity: 0 }}
                animate={{
                  offsetDistance: [null, "0%", "100%", "100%", "100%"],
                  opacity: [0, 0, 1, 0, 0],
                }}
                transition={{
                  duration: fullCycleDuration,
                  times: [0, startTime, endTime, resetTime, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                style={{ offsetPath: `path('${createCurvedPath(startPoint, endPoint)}')` }}
              />
              {/* Dots at endpoints */}
              <circle cx={startPoint.x} cy={startPoint.y} r={r1} fill={lineColor} opacity="0.6">
                <animate attributeName="r" from={r1} to={r3} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={startPoint.x} cy={startPoint.y} r={r1} fill={lineColor} />
              <circle cx={endPoint.x} cy={endPoint.y} r={r1} fill={lineColor} opacity="0.6">
                <animate attributeName="r" from={r1} to={r3} dur="2s" begin="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={endPoint.x} cy={endPoint.y} r={r1} fill={lineColor} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
