import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="heading-display mt-3 text-3xl font-bold">
        Página no encontrada
      </h1>
      <p className="mt-3 text-sm text-muted">
        El recurso que buscas no existe o ya no está disponible.
      </p>
      <Link href="/" className="btn-champagne mt-6">
        Volver al inicio
      </Link>
    </div>
  );
}
