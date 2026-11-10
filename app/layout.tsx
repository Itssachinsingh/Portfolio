import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";

import { themeBootScript } from "@/lib/themes";

import "./globals.css";

const heading = Inter_Tight({ subsets: ["latin"], variable: "--font-heading" });
const accent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-accent",
});
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: "Sachin Singh · Full-Stack Developer",
  description:
    "Full-stack developer in Dehradun, India, building web apps end to end with Next.js, TypeScript, Node.js and MongoDB.",
  icons: { icon: "/favicon.jpg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // the boot script sets the saved theme's colours on <html> before React hydrates
    <html
      lang="en"
      className={`${heading.variable} ${accent.variable} ${code.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="bg-ink font-heading text-mist">{children}</body>
    </html>
  );
}
