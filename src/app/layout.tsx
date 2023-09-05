import "@/app/styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Computer Science Society",
    default: "Computer Science Society",
  },
  viewport: {
    width: "device-width",
    minimumScale: 1,
  },
  description: "A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://css.uwindsor.ca",
    title: "Computer Science Society",
    description: "A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.",
    images: [
      {
        url: "/images/css-logo-shield.png",
        width: 2248,
        height: 2248,
        alt: "Computer Science Society",
      },
    ],
  },
  twitter: {
    card: 'app',
    title: 'Computer Science Society',
    description: 'A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.',
    creator: '@UWindsorCSS',
    images: {
      url: '/images/css-logo-shield.png',
      alt: 'Computer Science Society',
    },
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
          <Toaster />
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
