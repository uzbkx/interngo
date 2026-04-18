"use client";

import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    particlesJS?: (id: string, config: object) => void;
    pJSDom?: Array<{ pJS: { fn: { vendors: { destroypJS: () => void } } } }>;
  }
}

export function ParticlesBg({ className = "" }: { className?: string }) {
  const initParticles = useCallback((isDark: boolean) => {
    const oldCanvas = document.querySelector("#particles-js canvas");
    if (oldCanvas) oldCanvas.remove();

    if (window.pJSDom && window.pJSDom.length > 0) {
      window.pJSDom.forEach((p) => p.pJS.fn.vendors.destroypJS());
      window.pJSDom = [];
    }

    const colors = isDark
      ? { particles: "#00f5ff", lines: "#00d9ff", accent: "#0096c7" }
      : { particles: "#0277bd", lines: "#0288d1", accent: "#039be5" };

    window.particlesJS?.("particles-js", {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: colors.particles },
        shape: { type: "circle", stroke: { width: 0.5, color: colors.accent } },
        opacity: {
          value: 0.7,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.3 },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 1 },
        },
        line_linked: {
          enable: true,
          distance: 160,
          color: colors.lines,
          opacity: 0.4,
          width: 1.2,
        },
        move: { enable: true, speed: 2, random: true, out_mode: "bounce" },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 220, line_linked: { opacity: 0.8 } },
          push: { particles_nb: 4 },
          repulse: { distance: 180, duration: 0.4 },
        },
      },
      retina_detect: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const detectDark = () =>
      html.classList.contains("dark") || html.getAttribute("data-theme") === "dark";

    let observer: MutationObserver | null = null;

    const run = () => {
      initParticles(detectDark());
      observer = new MutationObserver(() => initParticles(detectDark()));
      observer.observe(html, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    };

    if (window.particlesJS) {
      run();
      return () => observer?.disconnect();
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-particles-lib="1"]',
    );
    if (existing) {
      existing.addEventListener("load", run, { once: true });
      return () => observer?.disconnect();
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    script.dataset.particlesLib = "1";
    script.onload = run;
    document.body.appendChild(script);

    return () => {
      observer?.disconnect();
    };
  }, [initParticles]);

  return (
    <div
      id="particles-js"
      className={`absolute inset-0 bg-gradient-to-tr from-[#000814] via-[#003566] to-[#0077b6] ${className}`}
    />
  );
}
