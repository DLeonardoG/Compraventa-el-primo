"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { siteConfig } from "@/config/site.config";

const initial: LoginState = {};

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        action={action}
        className="w-full max-w-md space-y-5 border border-border bg-card p-6 rounded-sm"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
            Acceso restringido
          </p>
          <h1 className="mt-2 text-xl font-semibold text-foreground">
            {siteConfig.shortName} Admin
          </h1>
          <p className="mt-1 text-sm text-muted">
            Ingresa con las credenciales del administrador.
          </p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.14em] text-muted">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.14em] text-muted">
            Contraseña
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full border border-border bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        {state.error ? (
          <p className="text-sm text-red-400">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-background disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
