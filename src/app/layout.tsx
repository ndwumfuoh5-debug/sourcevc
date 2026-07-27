import "globals.css";

import { type Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { lazy } from "react";
import { SWRProvider } from "@/components/SWRProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const ElementSelector = lazy(() =>
  process.env.NODE_ENV === "development"
    ? import("@/components/ElementSelector")
    : Promise.resolve({ default: () => null }),
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Healthworx Capital";

export const metadata: Metadata = {
  title: appName,
  description: "Backing the next generation of healthcare solutions.",
  icons: "https://vybe.build/vybe-icon.svg",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
    >
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SWRProvider>
            {children}
          </SWRProvider>
          <Toaster richColors />
          <ElementSelector />
        </ThemeProvider>
      </body>
    </html>
  );
}
