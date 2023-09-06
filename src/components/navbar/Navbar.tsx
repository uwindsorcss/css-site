import ThemeButton from "./ThemeButton";
import DesktopMenu from "./DesktopMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import AccountButton from "./AccountButton";

async function NavBar() {
  const session = await getServerSession(authOptions);

  const links: Link[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Discord", href: "/discord" },
    {
      name: "Resources",
      href: "#",
      sublinks: [
        {
          name: "Wiki",
          href: "https://uwindsorcss.github.io/css-wiki",
          description: "A wiki of everything CS at UWindsor.",
        },
        {
          name: "Store",
          href: "https://store.uwindsorcss.ca",
          description: "Buy CSS merch and swag.",
        },
        {
          name: "Gallery",
          href: "/gallery",
          description: "A gallery of photos from CSS events.",
        },
        {
          name: "Incoming Student Guide",
          href: "https://uwindsorcss.github.io/css-wiki/resources/guides/first_year",
          description: "A guide for new students to help them get started with CS at UWindsor.",
        },
      ],
    },
  ];

  return (
    <div className="z-50 w-screen h-16 fixed top-0 left-0 right-0 bg-primary text-primary-foreground">
      <div className="h-full px-8 mx-auto items-center max-w-7xl grid grid-row-1 grid-cols-2 lg:grid-cols-3 my-auto">
        <div className="flex justify-between py-2 justify-self-start">
          <Logo />
        </div>
        <DesktopMenu links={links} />
        <div className="flex gap-2 justify-self-end">
          <ThemeButton />
          <AccountButton session={session} />
          <MobileMenu links={links} />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
