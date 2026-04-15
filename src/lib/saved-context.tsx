"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface SavedContextType {
  savedIds: Set<string>;
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => Promise<boolean>;
  loading: boolean;
}

const SavedContext = createContext<SavedContextType>({
  savedIds: new Set(),
  isSaved: () => false,
  toggleSave: async () => false,
  loading: false,
});

function extractListingId(item: any): string | null {
  // listingId could be a populated object or a string
  if (typeof item.listingId === "string") return item.listingId;
  if (item.listingId?._id) return String(item.listingId._id);
  if (item.listing?._id) return String(item.listing._id);
  if (item._id) return String(item._id);
  return null;
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    setLoading(true);
    apiFetch("/saved")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.saved || []);
        const ids = new Set<string>(
          items.map(extractListingId).filter(Boolean) as string[]
        );
        setSavedIds(ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSave = useCallback(async (id: string): Promise<boolean> => {
    // Optimistic update
    const wasSaved = savedIds.has(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      const res = await apiFetch("/saved", {
        method: "POST",
        body: JSON.stringify({ listingId: id }),
      });
      const data = await res.json();
      const nowSaved = data.saved;

      // Correct if server disagrees
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (nowSaved) next.add(id);
        else next.delete(id);
        return next;
      });
      return nowSaved;
    } catch {
      // Revert on error
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(id);
        else next.delete(id);
        return next;
      });
      return wasSaved;
    }
  }, [savedIds]);

  return (
    <SavedContext.Provider value={{ savedIds, isSaved, toggleSave, loading }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}
