import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Zain } from "next/font/google";
import Providers from "@/components/Providers";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const zain = Zain({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-zain",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.nameAr}`,
  description: `${siteConfig.description} | ${siteConfig.descriptionAr}`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d2d2d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${zain.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-zain" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
