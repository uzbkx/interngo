"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ size = 32, className, priority = false }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch — render light variant until theme is known.
  const src = mounted && resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg";

  return (
    <Image
      src={src}
      alt="InternGo"
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-md", className)}
    />
  );
}
