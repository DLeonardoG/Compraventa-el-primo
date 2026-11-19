import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/logo.webp"
      alt={siteConfig.companyName}
      width={1024}
      height={1018}
      priority={priority}
      sizes="96px"
      className={cn("h-16 w-16 object-contain", className)}
    />
  );
}
