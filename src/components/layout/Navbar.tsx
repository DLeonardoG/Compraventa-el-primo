"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl, generalWhatsAppMessage } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { openConsignment } = useConsignment();

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="heading-display text-lg font-bold text-foreground sm:text-xl">
            {siteConfig.shortName}
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-accent">
            Automotriz & Inmobiliaria
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-accent" : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openConsignment}
            className="btn-outline hidden px-3 py-2 text-xs lg:inline-flex"
          >
            Vende tu vehículo
          </button>
          <a
            href={buildWhatsAppUrl(generalWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-champagne hidden px-3 py-2 text-xs sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex border border-border p-2 text-foreground xl:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background/95 px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2.5 text-sm font-medium text-foreground hover:bg-elevated"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openConsignment();
              }}
              className="btn-outline mt-2 text-sm"
            >
              Vende tu vehículo
            </button>
            <a
              href={buildWhatsAppUrl(generalWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-champagne mt-2 text-sm"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
