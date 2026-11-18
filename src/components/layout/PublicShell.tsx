"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Navbar } from "@/components/layout/Navbar";

export function PublicShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      {footer}
      <FloatingWhatsApp />
    </>
  );
}
