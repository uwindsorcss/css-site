"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import ThemeButton from "./ThemeButton";
import { Session } from "next-auth";
import SignOutButton from "../account/SignOutButton";
import SignInButton from "../account/SignInButton";
import Menu from "./Menu";
import Logo from "./Logo";

interface NavBarProps {
  session: Session | null;
  menuItems: { href: string; text: string }[];
}

function NavBar({ session, menuItems }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <div className="px-4 mx-auto items-center lg:max-w-7xl lg:px-8 lg:grid lg:grid-row-1 lg:grid-cols-3">
      <div className="flex justify-between py-2 justify-self-start">
        <Logo />
        {/* Mobile Buttons*/}
        <div className="lg:hidden flex gap-2">
          <ThemeButton />
          {session ? <SignOutButton /> : <SignInButton />}
          <Button variant="outline" size="icon" onClick={() => setOpen(!open)}>
            {open ? (
              <AiOutlineClose className="text-md" />
            ) : (
              <GiHamburgerMenu className="text-md" />
            )}
          </Button>
        </div>
      </div>
      <Menu menuItems={menuItems} navbar={open} toggleOpen={toggleOpen} />
      {/* Desktop Buttons*/}
      <div className="hidden lg:flex items-center gap-2 justify-self-end">
        <ThemeButton />
        {session ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
}

export default NavBar;
