"use client";

import { ChevronDown, Clock, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppUrl, generalWhatsAppMessage } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type NavChild = { label: string; href: string };

function pathOf(href: string) {
  return href.split("?")[0]?.split("#")[0] ?? href;
}

function isActive(pathname: string, href: string) {
  const path = pathOf(href);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [topVisible, setTopVisible] = useState(true);
  const lastY = useRef(0);
  const { openConsignment } = useConsignment();
  const whatsappHref = buildWhatsAppUrl(generalWhatsAppMessage());

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 12) setTopVisible(true);
      else if (y > lastY.current + 6) setTopVisible(false);
      else if (y < lastY.current - 6) setTopVisible(true);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function sell() {
    setOpen(false);
    openConsignment();
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "hidden overflow-hidden border-b border-[#18181C] bg-[#09090B] transition-[max-height,opacity] duration-300 lg:block",
          topVisible ? "max-h-9 opacity-100" : "max-h-0 border-transparent opacity-0",
        )}
      >
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-[11px] tracking-wider text-[#A1A1AA] sm:px-6 lg:px-8">
          <p className="flex min-w-0 items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              {siteConfig.city} / {siteConfig.region}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Clock className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{siteConfig.hoursCompact}</span>
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <Link href="/nosotros#formteam" className="transition-colors hover:text-[#F4F4F5]">
              Trabaja con nosotros
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-[#F4F4F5] xl:inline-flex"
            >
              <Mail className="h-3 w-3" strokeWidth={1.5} />
              {siteConfig.email}
            </a>
            <a
              href={`tel:+${siteConfig.whatsappNumber}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F4F4F5]"
            >
              <Phone className="h-3 w-3" strokeWidth={1.5} />
              {siteConfig.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-[#222226] bg-[#09090B]/95 backdrop-blur-md">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0" aria-label={siteConfig.companyName}>
            <BrandLogo priority className="h-[4.5rem] w-[4.5rem]" />
          </Link>

          <nav className="hidden items-center xl:flex xl:gap-3 2xl:gap-7">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              const children = "children" in item ? (item.children as readonly NavChild[]) : undefined;
              const accent = "accent" in item && item.accent;
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors",
                      active ? "text-[#F4F4F5]" : "text-[#A1A1AA] hover:text-[#F4F4F5]",
                    )}
                  >
                    {accent ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" aria-hidden />
                    ) : null}
                    {item.label}
                    {children ? (
                      <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
                    ) : null}
                    {active ? (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#C5A059]" />
                    ) : null}
                  </Link>
                  {children ? (
                    <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="min-w-[250px] rounded-sm border border-[#222226] bg-[#111114] p-1.5">
                        {children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-sm px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#A1A1AA] transition-colors hover:bg-[#18181C] hover:text-[#F4F4F5]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={sell}
              className="hidden rounded-sm border border-[#C5A059] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#09090B] xl:inline-flex 2xl:px-4 2xl:py-2.5"
            >
              Vende tu vehículo
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-sm bg-[#15803D] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#166534] sm:inline-flex 2xl:px-4 2xl:py-2.5"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              WhatsApp
            </a>
            <button
              type="button"
              className="inline-flex border border-[#222226] p-2 text-[#F4F4F5] xl:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#09090B] xl:hidden">
          <div className="flex h-24 items-center justify-between border-b border-[#222226] px-4">
            <Link href="/" aria-label={siteConfig.companyName} onClick={() => setOpen(false)}>
              <BrandLogo className="h-[4.5rem] w-[4.5rem]" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-[#222226] p-2"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {siteConfig.nav.map((item) => {
              const children = "children" in item ? (item.children as readonly NavChild[]) : undefined;
              const active = isActive(pathname, item.href);
              if (!children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between border-b border-[#18181C] px-5 py-4 text-xs font-medium uppercase tracking-[0.12em]",
                      active ? "text-[#F4F4F5]" : "text-[#A1A1AA]",
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {"accent" in item && item.accent ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                      ) : null}
                      {item.label}
                    </span>
                  </Link>
                );
              }
              const isOpen = expanded === item.href;
              return (
                <div key={item.href} className="border-b border-[#18181C]">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.href)}
                    className="flex w-full items-center justify-between px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[#F4F4F5]"
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                      strokeWidth={1.5}
                    />
                  </button>
                  {isOpen ? (
                    <div className="bg-[#111114]">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block border-t border-[#18181C] px-7 py-3 text-[11px] uppercase tracking-[0.12em] text-[#A1A1AA]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-[#18181C] p-4">
            <button
              type="button"
              onClick={sell}
              className="w-full rounded-sm border border-[#C5A059] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#09090B]"
            >
              Vende tu vehículo
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#15803D] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#166534]"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
