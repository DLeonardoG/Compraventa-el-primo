"use client";

import { ChevronLeft, ChevronRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useConsignment } from "@/components/providers/ConsignmentProvider";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

const HEADER_OFFSET = "top-[4.75rem]";

type NavChild = { label: string; href: string };
type NavItem = (typeof siteConfig.nav)[number];

function pathOf(href: string) {
  return href.split("?")[0]?.split("#")[0] ?? href;
}

function isActive(pathname: string, href: string, exact = false) {
  if (href.includes("?") || href.includes("#")) return false;
  const path = pathOf(href);
  if (path === "/") return pathname === "/";
  if (exact) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function childrenOf(item: NavItem): readonly NavChild[] | undefined {
  return "children" in item ? item.children : undefined;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openConsignment } = useConsignment();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sectionHref, setSectionHref] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const solid = !isHome || open || searchOpen || scrolled;
  const section = siteConfig.nav.find((item) => item.href === sectionHref);
  const sectionChildren = section ? childrenOf(section) : undefined;

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setSectionHref(null);
  }, [pathname]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open || searchOpen ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, searchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open && !searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (sectionHref) {
        setSectionHref(null);
        return;
      }
      setOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, searchOpen, sectionHref]);

  function toggleMenu() {
    setSearchOpen(false);
    setSectionHref(null);
    setOpen((current) => !current);
  }

  function toggleSearch() {
    setOpen(false);
    setSectionHref(null);
    setSearchOpen((current) => !current);
  }

  function sell() {
    setOpen(false);
    setSectionHref(null);
    openConsignment();
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = String(data.get("q") ?? "").trim();
    setSearchOpen(false);
    router.push(query ? `/vehiculos?q=${encodeURIComponent(query)}` : "/vehiculos");
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-[#0b0b0b]" : "bg-transparent",
      )}
    >
      <div className="relative flex h-[4.75rem] items-center justify-between px-4 sm:px-8">
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-11 w-11 items-center justify-center text-white"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2"
          aria-label={siteConfig.companyName}
          onClick={() => {
            setOpen(false);
            setSearchOpen(false);
          }}
        >
          <BrandLogo priority className="h-12 w-12 sm:h-14 sm:w-14" />
        </Link>

        <button
          type="button"
          onClick={toggleSearch}
          className="inline-flex h-11 w-11 items-center justify-center text-white"
          aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Search className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </div>

      {searchOpen ? (
        <form
          onSubmit={onSearch}
          className={cn("fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-black px-6 py-8 sm:px-12", HEADER_OFFSET)}
        >
          <label htmlFor="site-search" className="sr-only">
            Buscar vehículos
          </label>
          <div className="mx-auto flex max-w-5xl items-end gap-4 border-b border-white/30 pb-3">
            <input
              id="site-search"
              name="q"
              autoFocus
              placeholder="Buscar vehículos"
              className="w-full bg-transparent text-2xl font-medium uppercase tracking-[0.12em] text-white outline-none placeholder:text-white/35 sm:text-3xl"
            />
            <button
              type="submit"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-white"
            >
              Buscar
            </button>
          </div>
        </form>
      ) : null}

      {open ? (
        <div
          id="site-menu"
          className={cn("fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-black", HEADER_OFFSET)}
        >
          <nav aria-label="Principal" className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-12">
            {section && sectionChildren ? (
              <div>
                <button
                  type="button"
                  onClick={() => setSectionHref(null)}
                  className="mb-8 flex items-center gap-4 text-3xl font-semibold uppercase tracking-[0.08em] text-white sm:text-5xl"
                >
                  <ChevronLeft className="h-7 w-7" strokeWidth={1.5} />
                  {section.label}
                </button>
                <ul>
                  {sectionChildren.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          "block border-b border-white/25 py-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-white/70",
                          isActive(pathname, child.href, true) && "text-[#C5A059]",
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
                  {siteConfig.nav.map((item) => {
                    const children = childrenOf(item);
                    const active = isActive(pathname, item.href);
                    const accent = "accent" in item && item.accent;
                    const rowClass = cn(
                      "flex w-full items-center justify-between border-b border-white/25 py-5 text-left text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-white/70",
                      active && "text-[#C5A059]",
                      accent && !active && "text-[#C5A059]",
                    );

                    if (children) {
                      return (
                        <li key={item.href}>
                          <button
                            type="button"
                            onClick={() => setSectionHref(item.href)}
                            className={rowClass}
                            aria-expanded={sectionHref === item.href}
                          >
                            {item.label}
                            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <Link href={item.href} className={rowClass}>
                          {item.label}
                          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <button type="button" onClick={sell} className="flex w-full items-center justify-between border-b border-white/25 py-5 text-left text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-white/70">
                      Vende tu vehículo
                      <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </li>
                </ul>
                <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-white/45">
                  <span>
                    {siteConfig.city} / {siteConfig.region}
                  </span>
                  <a href={`tel:+${siteConfig.whatsappNumber}`} className="hover:text-white">
                    {siteConfig.whatsappDisplay}
                  </a>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                    {siteConfig.email}
                  </a>
                </div>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
