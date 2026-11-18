import type { NextConfig } from "next";

function s3Hostname(): string | null {
  const raw = process.env.S3_PUBLIC_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
];

const hostname = s3Hostname();
if (hostname) {
  remotePatterns.push({
    protocol: "https",
    hostname,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
