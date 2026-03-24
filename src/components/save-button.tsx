"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";

interface SaveButtonProps {
  listingId: string;
  className?: string;
}

export function SaveButton({ listingId, className }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const tc = useTranslations("common");

  useEffect(() => {
    apiFetch(`/saved/${listingId}`)
      .then((res) => res.json())
      .then((data) => setSaved(data.saved))
      .catch(() => {});
  }, [listingId]);

  async function toggleSave() {
    setLoading(true);
    try {
      const res = await apiFetch("/saved", {
        method: "POST",
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      className={className}
      onClick={toggleSave}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`mr-2 h-4 w-4 ${saved ? "fill-current" : ""}`} />
      )}
      {saved ? tc("saved") : tc("save")}
    </Button>
  );
}
