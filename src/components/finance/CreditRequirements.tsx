"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const profiles = [
  {
    id: "empleados",
    label: "Empleados",
    items: [
      "Cédula de ciudadanía",
      "Certificado laboral con cargo, salario y antigüedad",
      "Últimos dos desprendibles de nómina",
      "Extractos bancarios de los últimos dos meses",
    ],
  },
  {
    id: "independientes",
    label: "Independientes",
    items: [
      "Cédula de ciudadanía y RUT",
      "Cámara de comercio vigente, si aplica",
      "Extractos bancarios de los últimos tres meses",
      "Declaración de renta del último periodo gravable",
    ],
  },
  {
    id: "pensionados",
    label: "Pensionados / Empresas",
    items: [
      "Cédula y resolución o desprendible de pensión",
      "Para empresas: cámara de comercio y estados financieros",
      "Extractos bancarios recientes",
      "Referencias comerciales del titular o de la sociedad",
    ],
  },
] as const;

export function CreditRequirements() {
  const [active, setActive] = useState<(typeof profiles)[number]["id"]>("empleados");
  const current = profiles.find((profile) => profile.id === active) ?? profiles[0];

  return (
    <div className="border border-border bg-card p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
        Estudio de crédito
      </p>
      <h2 className="heading-display mt-2 text-xl font-bold">Requisitos</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => setActive(profile.id)}
            className={cn(
              "rounded-sm border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
              active === profile.id
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-[#222226] text-[#A1A1AA] hover:text-[#F4F4F5]",
            )}
          >
            {profile.label}
          </button>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {current.items.map((item) => (
          <li
            key={item}
            className="border-b border-[#18181C] pb-3 text-sm text-[#A1A1AA] last:border-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
