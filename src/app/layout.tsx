import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "An interactive, first-principles course in computer-aided drug design, from structural bioinformatics and molecular docking to AI, DMPK, biologics, and reproducible workflows.";

export const metadata: Metadata = {
  // Module routes supply their own `title`; the template appends the site name
  // so every page gets a distinct, self-describing tab and search result.
  title: {
    default: "Learn CADD — Computer-Aided Drug Design",
    template: "%s — Learn CADD",
  },
  description: siteDescription,
  openGraph: {
    title: "Learn CADD — Computer-Aided Drug Design",
    description: siteDescription,
    siteName: "Learn CADD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn CADD — Computer-Aided Drug Design",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground font-sans">
        <ThemeProvider>
          <a
            href="#course-content"
            className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-slate-950 px-4 py-3 font-bold text-white focus:not-sr-only"
          >
            Skip to course content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-PNDB5NQR51" />
    </html>
  );
}
