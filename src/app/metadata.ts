import type { Metadata } from "next";

const title = "Computer Science Society";
const description =
  "A student-run organization committed to provide a community for Computer Science students.";
const url = "https://css.uwindsor.ca";

export const metadataObject: Metadata = {
  title: {
    template: `%s | ${title}`,
    default: title,
  },
  description: description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(`${process.env.NEXTAUTH_URL}`),
  openGraph: {
    type: "website",
    url: url,
    title: title,
    description: description,
    images: "/images/css-logo-shield.png",
  },
  twitter: {
    card: "app",
    title: title,
    description: description,
    creator: "@UWindsorCSS",
    images: {
      url: `${process.env.NEXTAUTH_URL}/images/css-logo-shield.png`,
      alt: title,
    },
    app: {
      name: title,
      id: {
        iphone: url,
        ipad: url,
        googleplay: url,
      },
      url: {
        iphone: url,
        ipad: url,
      },
    },
  },
};

export const viewportObject = {
  width: "device-width",
  minimumScale: 1,
  themeColor: "#141a2f",
};
