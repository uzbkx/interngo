"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Sparkles, MapPin, Users } from "lucide-react";

export function LiveStats() {
  const [total, setTotal] = useState(0);
  const [countries, setCountries] = useState(0);

  useEffect(() => {
    apiFetch("/listings?limit=1")
      .then((r) => r.json())
      .then((d) => {
        setTotal(d.total || 0);
      })
      .catch(() => {});

    // Estimate countries from a larger fetch
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

  const stats = [
    { label: "Opportunities", value: total || "—", icon: Sparkles },
    { label: "Countries", value: countries ? `${countries}+` : "—", icon: MapPin },
    { label: "Students", value: "500+", icon: Users },
  ];

  return (
    <div className="flex justify-center gap-8 md:gap-16">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <stat.icon className="h-5 w-5 mx-auto mb-1 text-primary/60" />
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
