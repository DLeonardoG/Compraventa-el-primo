import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-[#07070a]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xl font-extrabold tracking-tight">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {siteConfig.tagline}. Plataforma comercial autoadministrable con
            enfoque ejecutivo en vehículos y parcelas.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Navegación
          </p>
          <ul className="space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm text-muted">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Contacto
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {siteConfig.address}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-accent" />
            {siteConfig.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-accent" />
            <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
              {siteConfig.email}
            </a>
          </p>
          <p className="pt-1 text-xs">{siteConfig.schedule}</p>
        </div>
      </div>

      <div className="border-t border-border/70 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
