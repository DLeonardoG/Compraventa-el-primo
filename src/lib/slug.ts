export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, suffix?: string | number): string {
  const root = slugify(base) || "item";
  if (suffix === undefined || suffix === "") return root;
  return `${root}-${suffix}`;
}
