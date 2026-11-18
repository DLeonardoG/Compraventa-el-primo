"use client";

import { ConsignmentProvider } from "@/components/providers/ConsignmentProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ConsignmentModal } from "@/components/modals/ConsignmentModal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConsignmentProvider>
        {children}
        <ConsignmentModal />
      </ConsignmentProvider>
    </ToastProvider>
  );
}
