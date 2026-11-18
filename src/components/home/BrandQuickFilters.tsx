"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Vehicle } from "@/types/inventory";
import { cn } from "@/lib/utils";

const PRIORITY = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Toyota",
  "Mazda",
  "Porsche",
  "Ford",
  "Chevrolet",
  "Renault",
];

export function BrandQuickFilters({ vehicles }: { vehicles: Vehicle[] }) {
  const brands = useMemo(() => {
    const available = Array.from(new Set(vehicles.map((v) => v.marca)));
    const prioritized = PRIORITY.filter((brand) => available.includes(brand));
    const rest = available.filter((brand) => !PRIORITY.includes(brand)).sort();
    return [...prioritized, ...rest];
  }, [vehicles]);

  return (
    <section className="border-y border-border bg-[#0b0b0e]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/vehiculos"
            className={cn(
              "shrink-0 border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-foreground hover:text-foreground",
            )}
          >
            Todas
          </Link>
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/vehiculos?marca=${encodeURIComponent(brand)}`}
              className="shrink-0 border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-accent"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
