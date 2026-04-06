"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

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
    { label: "Opportunities", value: total || "—" },
    { label: "Countries", value: countries ? `${countries}+` : "—" },
    { label: "Students", value: "500+" },
  ];

  return (
    <div className="flex justify-center gap-10">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl font-bold text-primary">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
