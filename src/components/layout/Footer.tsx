import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

const shortcuts = [
  { label: "Vender un vehículo", href: "/contacto" },
  { label: "Línea Prestige", href: "/prestige" },
  { label: "Importación bajo pedido", href: "/importacion" },
  { label: "Parcelas y lotes", href: "/parcelas" },
  { label: "Trabaja con nosotros", href: "/nosotros#formteam" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-[#070709]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="heading-display text-xl font-bold text-foreground">
            {siteConfig.shortName}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-subtle">
            {siteConfig.city}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {siteConfig.companyName} Inventario curado, importación bajo pedido
            y parcelas con documentación clara.
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Navegación
          </p>
          <ul className="space-y-2.5">
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
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Sede y horario
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
            <span>
              {siteConfig.address}
              <span className="block text-subtle">{siteConfig.city}</span>
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
            {siteConfig.whatsappDisplay}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
            <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
              {siteConfig.email}
            </a>
          </p>
          <p className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
            <span>{siteConfig.schedule}</span>
          </p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Accesos directos
          </p>
          <ul className="space-y-2.5">
            {shortcuts.map((item) => (
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
          <div className="mt-5 flex gap-4 text-xs uppercase tracking-[0.14em] text-subtle">
            <a href={siteConfig.social.instagram} className="hover:text-accent">
              Instagram
            </a>
            <a href={siteConfig.social.facebook} className="hover:text-accent">
              Facebook
            </a>
            <a href={siteConfig.social.tiktok} className="hover:text-accent">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-subtle">
        {new Date().getFullYear()} {siteConfig.companyName}. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
