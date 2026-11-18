import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  className?: string;
  label?: string;
};

export function ImagePlaceholder({
  className,
  label = "Sin imagen",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1a1a20] to-[#0d0d10] text-muted",
        className,
      )}
    >
      <ImageIcon className="h-8 w-8 opacity-50" />
      <span className="text-xs tracking-wide uppercase">{label}</span>
    </div>
  );
}
