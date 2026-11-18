import type { MediaItem } from "@/types/inventory";

export function coverUrl(media: MediaItem[]): string {
  const cover =
    media.find((item) => item.esPortada && item.tipo === "IMAGE") ??
    media.find((item) => item.tipo === "IMAGE") ??
    media[0];
  return cover?.url ?? "";
}
