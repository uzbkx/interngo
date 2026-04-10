"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { NumberTicker } from "@/components/ui/number-ticker";

export function LiveStats() {
  const [total, setTotal] = useState(0);
  const [countries, setCountries] = useState(0);

  useEffect(() => {
    apiFetch("/listings?limit=1")
      .then((r) => r.json())
      .then((d) => setTotal(d.total || 0))
      .catch(() => {});

    apiFetch("/listings?limit=50")
      .then((r) => r.json())
      .then((d) => {
        const c = new Set(
          (d.listings || []).map((l: any) => l.country).filter(Boolean)
        );
        setCountries(Math.max(c.size, 5));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex justify-center gap-12 md:gap-16">
      {[
        { value: total || 150, suffix: "+", label: "Opportunities" },
        { value: countries || 30, suffix: "+", label: "Countries" },
        { value: 1000, suffix: "+", label: "Students" },
      ].map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl md:text-3xl font-extrabold text-gradient">
            <NumberTicker value={stat.value} className="text-gradient" />
            {stat.suffix}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
