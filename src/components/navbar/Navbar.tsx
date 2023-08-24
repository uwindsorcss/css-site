import ThemeButton from "./ThemeButton";
import SignOutButton from "../account/SignOutButton";
import SignInButton from "../account/SignInButton";
import DesktopMenu from "./DesktopMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

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
          name: "Tutoring Schedule",
          href: "http://tutor.cs.uwindsor.ca",
          description: "Tutoring schedule for the current semester.",
        },
        {
          name: "Facebook Group",
          href: "https://www.facebook.com/groups/210441872352826",
          description:
            "Join the Compsci Kool Kats Facebook group to stay up to date.",
        },
        {
          name: "Student Guide",
          href: "https://css.uwindsor.ca/guide",
          description: "A guide for new students to the University of Windsor.",
        },
        {
          name: "UWindsor Timetable Creator",
          href: "https://utable.net",
          description: "A timetable creator for UWindsor students.",
        },
        {
          name: "Job Tracker Chrome Extension",
          href: "https://chrome.google.com/webstore/detail/eztrackr/kdpbamlhffmfbgglmaedhopenkpgkfdg",
          description: "A Chrome extension to track job postings.",
        },
      ],
    },
  ];

  return (
    <div className="z-10 w-full h-16 fixed top-0 left-0 right-0 bg-primary text-primary-foreground">
      <div className="h-full px-4 lg:px-8 mx-auto items-center max-w-7xl grid grid-row-1 grid-cols-2 lg:grid-cols-3 my-auto">
        <div className="flex justify-between py-2 justify-self-start">
          <Logo />
        </div>
        <DesktopMenu links={links} />
        <div className="flex gap-2 justify-self-end">
          <ThemeButton />
          {session ? <SignOutButton /> : <SignInButton />}
          <MobileMenu links={links} />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
