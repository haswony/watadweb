"use client";

import { useState } from "react";

interface CatalogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function isDataImage(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

function ImagePlaceholder({
  fill,
  className = "",
}: {
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#e5e7eb] ${fill ? "absolute inset-0 h-full w-full" : ""} ${className}`}
      aria-hidden
    />
  );
}

export default function CatalogImage({
  src,
  alt,
  fill,
  className = "",
  width,
  height,
}: CatalogImageProps) {
  const [failed, setFailed] = useState(false);
  const trimmed = src?.trim() ?? "";

  if (!trimmed || failed) {
    return <ImagePlaceholder fill={fill} className={className} />;
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={trimmed}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
