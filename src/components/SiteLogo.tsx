"use client";

import { useCatalog } from "@/hooks/useCatalog";

interface SiteLogoProps {
  className?: string;
}

export default function SiteLogo({ className = "" }: SiteLogoProps) {
  const { logoBold: bold, logoLight: light } = useCatalog();

  return (
    <span className={className}>
      {bold}
      <span className="font-light">{light}</span>
    </span>
  );
}
