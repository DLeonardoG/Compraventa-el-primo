"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ConsignmentContextValue = {
  open: boolean;
  openConsignment: () => void;
  closeConsignment: () => void;
};

const ConsignmentContext = createContext<ConsignmentContextValue | null>(null);

export function ConsignmentProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openConsignment = useCallback(() => setOpen(true), []);
  const closeConsignment = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openConsignment, closeConsignment }),
    [open, openConsignment, closeConsignment],
  );

  return (
    <ConsignmentContext.Provider value={value}>
      {children}
    </ConsignmentContext.Provider>
  );
}

export function useConsignment() {
  const ctx = useContext(ConsignmentContext);
  if (!ctx) {
    throw new Error("useConsignment must be used within ConsignmentProvider");
  }
  return ctx;
}
