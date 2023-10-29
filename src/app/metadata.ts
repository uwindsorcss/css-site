import type { Metadata } from "next";

export const metadataObject: Metadata = {
  title: {
    template: "%s | Computer Science Society",
    default: "Computer Science Society",
  },
  description:
    "A student-run organization that aims to provide a community for Computer Science students at the University of Windsor.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
