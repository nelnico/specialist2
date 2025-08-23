import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./app-providers";
import { siteConfig } from "@/lib/data/site-config";
import Header from "@/components/navigation/header";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-w-80  antialiased">
        <AppProviders>
          <Header />
          <main className="relative">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
