"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type SafeImageProps = {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed || !isHttpUrl(src)) {
    return <ImagePlaceholder className={cn(fill && "absolute inset-0", className)} />;
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
