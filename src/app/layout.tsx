import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { PublicShell } from "@/components/layout/PublicShell";
import { AppProviders } from "@/components/providers/AppProviders";
import { siteConfig } from "@/config/site.config";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.companyName,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const themeStyle = {
    "--background": siteConfig.theme.background,
    "--foreground": siteConfig.theme.foreground,
    "--card": siteConfig.theme.card,
    "--border": siteConfig.theme.border,
    "--elevated": siteConfig.theme.elevated,
    "--accent": siteConfig.theme.accent,
    "--accent-hover": siteConfig.theme.accentHover,
    "--whatsapp": siteConfig.theme.whatsapp,
    "--whatsapp-hover": siteConfig.theme.whatsappHover,
    "--muted": siteConfig.theme.muted,
  } as CSSProperties;

  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        style={themeStyle}
      >
        <AppProviders>
          <PublicShell footer={<Footer />}>{children}</PublicShell>
        </AppProviders>
      </body>
    </html>
  );
}
