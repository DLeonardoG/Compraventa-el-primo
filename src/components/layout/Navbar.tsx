"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, generalWhatsAppMessage } from "@/lib/whatsapp";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            {siteConfig.shortName}
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted group-hover:text-accent transition-colors">
            Compraventa S.A.S.
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
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
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-accent"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppUrl(generalWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden sm:inline-flex text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex rounded-md border border-border p-2 text-foreground lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background/95 px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-card"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={buildWhatsAppUrl(generalWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
