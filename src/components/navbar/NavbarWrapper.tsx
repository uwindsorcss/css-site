import NavBar from "./Navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

async function NavbarWrapper() {
  const session = await getServerSession(authOptions);

  const menuItems = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
    { href: "/events", text: "Events" },
    { href: "/newsletter", text: "Newsletter" },
    { href: "/discord", text: "Discord" },
  ];

  return (
    <nav className="w-full bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-10">
      <NavBar session={session} menuItems={menuItems} />
    </nav>
  );
}

export default NavbarWrapper;
