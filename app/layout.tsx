import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { getContent } from "@/lib/content";
import { themeToCss } from "@/lib/themes";
import { env } from "@/lib/env";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const heading = Sora({ variable: "--font-heading", subsets: ["latin"], weight: ["600", "700", "800"] });
const code = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: `${settings.brandName} · ${settings.tagline}`, template: `%s · ${settings.brandName}` },
    description: settings.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { theme } = await getContent();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${body.variable} ${heading.variable} ${code.variable} h-full antialiased`}
      style={themeToCss(theme) as CSSProperties}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
