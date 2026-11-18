"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Car,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MapPinned,
  MessageSquare,
} from "lucide-react";
import { logout } from "@/app/admin/actions";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/vehiculos", label: "Vehículos", icon: Car },
  { href: "/admin/parcelas", label: "Parcelas", icon: MapPinned },
  { href: "/admin/solicitudes", label: "Solicitudes y Leads", icon: MessageSquare },
  { href: "/admin/postulaciones", label: "Hojas de Vida", icon: Briefcase },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-border bg-card lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-border px-5 py-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
          Panel Admin
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {siteConfig.shortName}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-elevated text-accent"
                  : "text-muted hover:bg-elevated hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-muted hover:bg-elevated hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Sitio Público
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-muted hover:bg-elevated hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
