import "@/app/styles/global.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { metadataObject } from "./metadata";

const inter = Inter({ subsets: ["latin"] });
export const metadata = metadataObject;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
