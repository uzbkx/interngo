"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  isDark?: boolean;
}

export function WorldMap({ dots = [], lineColor = "#4f46e5", isDark = false }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () => map.getSVG({
      radius: 0.22,
      color: isDark ? "#FFFFFF15" : "#00000015",
      shape: "circle",
      backgroundColor: "transparent",
    }),
    [map, isDark]
  );

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const staggerDelay = 0.3;
  const animationDuration = 2;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const fullCycleDuration = totalAnimationTime + 2;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
          alt=""
          height={495}
          width={1056}
          draggable={false}
          priority
        />
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
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
                strokeWidth="1"
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
                r="3"
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
              <circle cx={startPoint.x} cy={startPoint.y} r="2" fill={lineColor} opacity="0.6">
                <animate attributeName="r" from="2" to="8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={startPoint.x} cy={startPoint.y} r="2" fill={lineColor} />
              <circle cx={endPoint.x} cy={endPoint.y} r="2" fill={lineColor} opacity="0.6">
                <animate attributeName="r" from="2" to="8" dur="2s" begin="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={endPoint.x} cy={endPoint.y} r="2" fill={lineColor} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
