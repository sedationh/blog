import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SedationH - Personal Blog",
  description: "A personal blog sharing technical insights, learning notes, and life reflections",
  keywords: ["blog", "tech", "frontend", "Next.js", "React", "JavaScript", "TypeScript"],
  authors: [{ name: "SedationH", url: "https://github.com/sedationh" }],
  creator: "SedationH",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SedationH - Personal Blog",
    description: "A personal blog sharing technical insights, learning notes, and life reflections",
    siteName: "SedationH Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "SedationH - Personal Blog",
    description: "A personal blog sharing technical insights, learning notes, and life reflections",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
