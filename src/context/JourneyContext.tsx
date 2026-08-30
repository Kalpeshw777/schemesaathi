"use client";

import type { Profile, Recommendation } from "@/lib/types";
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export interface JourneyState {
  profile?: Profile;
  recommendation?: Recommendation;
}

const STORAGE_KEY = "loansaathi-journey";
const EMPTY: JourneyState = {};

let state: JourneyState | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function readStore(): JourneyState {
  if (state !== null) return state;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    state = raw ? (JSON.parse(raw) as JourneyState) : {};
  } catch {
    state = {};
  }
  return state;
}

function writeStore(next: JourneyState) {
  state = next;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): JourneyState {
  return typeof window === "undefined" ? EMPTY : readStore();
}

function getServerSnapshot(): JourneyState {
  return EMPTY;
}

function getReady(): boolean {
  if (typeof window === "undefined") return false;
  readStore();
  return true;
}

interface JourneyContextValue extends JourneyState {
  ready: boolean;
  setJourney: (next: JourneyState) => void;
  reset: () => void;
}

const noop = () => {};

const JourneyContext = createContext<JourneyContextValue>({
  ready: false,
  setJourney: noop,
  reset: noop,
});

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribe, getReady, () => false);

  const value = useMemo(
    () => ({ ...snapshot, ready, setJourney: writeStore, reset: () => writeStore({}) }),
    [snapshot, ready]
  );
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  return useContext(JourneyContext);
}
