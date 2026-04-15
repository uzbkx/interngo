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
      .then((res) => res.ok ? res.json() : { saved: [] })
      .then((data) => {
        const ids = new Set<string>(
          (data.saved || data || []).map((s: any) => s.listingId || s.listing?._id || s._id).filter(Boolean)
        );
        setSavedIds(ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSave = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await apiFetch("/saved", {
        method: "POST",
        body: JSON.stringify({ listingId: id }),
      });
      const data = await res.json();
      const nowSaved = data.saved;
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (nowSaved) next.add(id);
        else next.delete(id);
        return next;
      });
      return nowSaved;
    } catch {
      return false;
    }
  }, []);

  return (
    <SavedContext.Provider value={{ savedIds, isSaved, toggleSave, loading }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}
