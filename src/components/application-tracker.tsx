"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Loader2, Check } from "lucide-react";

const STATUS_KEYS = [
  "INTERESTED",
  "APPLIED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;

interface ApplicationTrackerProps {
  listingId: string;
}

export function ApplicationTracker({ listingId }: ApplicationTrackerProps) {
  const tl = useTranslations("listings");
  const ts = useTranslations("status");
  const tc = useTranslations("common");

  const [isTracking, setIsTracking] = useState(false);
  const [status, setStatus] = useState("INTERESTED");
  const [notes, setNotes] = useState("");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/applications")
      .then((res) => res.json())
      .then((data) => {
        const app = data.applications?.find(
          (a: { listingId: string }) => a.listingId === listingId
        );
        if (app) {
          setIsTracking(true);
          setStatus(app.status);
          setNotes(app.notes || "");
          setApplicationId(app.id);
        }
      })
      .catch(() => {});
  }, [listingId]);

  async function startTracking() {
    setLoading(true);
    try {
      const res = await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({ listingId, status: "INTERESTED" }),
      });
      const data = await res.json();
      setApplicationId(data.application.id);
      setIsTracking(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    if (!applicationId) return;
    setStatus(newStatus ?? "INTERESTED");
    await apiFetch(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function saveNotes() {
    if (!applicationId) return;
    setSaved(false);
    await apiFetch(`/applications/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!isTracking) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={startTracking}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ClipboardList className="mr-2 h-4 w-4" />
        )}
        {tl("trackApplication")}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          {tl("applicationStatus")}
        </label>
        <Select value={status} onValueChange={(v) => updateStatus(v ?? status)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {ts(key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-xs"
        onClick={() => setShowNotes(!showNotes)}
      >
        {showNotes ? tc("hideNotes") : tc("addNotes")}
      </Button>

      {showNotes && (
        <div className="space-y-2">
          <Textarea
            placeholder={tc("notesPlaceholder")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <Button size="sm" onClick={saveNotes} className="w-full">
            {saved ? (
              <>
                <Check className="mr-1 h-3 w-3" /> {tc("saved")}
              </>
            ) : (
              tc("saveNotes")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
