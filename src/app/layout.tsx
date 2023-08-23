import "./global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/footer/Footer";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSS Site",
  description: "CSS Site",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <NavbarWrapper />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
