import "@/app/styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

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
  description:
    "A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0f1627",
  metadataBase: new URL(`${process.env.NEXTAUTH_URL}`),
  openGraph: {
    type: "website",
    url: "https://css.uwindsor.ca",
    title: "Computer Science Society",
    description:
      "A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.",
    images: "/images/css-logo-shield.png",
  },
  twitter: {
    card: "app",
    title: "Computer Science Society",
    description:
      "A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.",
    creator: "@UWindsorCSS",
    images: {
      url: `${process.env.NEXTAUTH_URL}/images/css-logo-shield.png`,
      alt: "Computer Science Society",
    },
    app: {
      name: "Computer Science Society",
      id: {
        iphone: "https://css.uwindsor.ca",
        ipad: "https://css.uwindsor.ca",
        googleplay: "https://css.uwindsor.ca",
      },
      url: {
        iphone: "https://css.uwindsor.ca",
        ipad: "https://css.uwindsor.ca",
      },
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <NextTopLoader
            color="#F0F0F2"
            easing="ease-in-out"
            height={2}
            shadow={false}
            showSpinner={false}
            crawl={false}
            speed={400}
          />
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
