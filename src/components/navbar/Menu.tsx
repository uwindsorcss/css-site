"use client";

import clsx from "clsx";
import MenuItem from "./MenuItem";

interface MenuItemProps {
  menuItems: {
    href: string;
    text: string;
  }[];
  navbar: boolean;
  toggleOpen: () => void;
}

function Menu({ menuItems, navbar, toggleOpen }: MenuItemProps) {
  return (
    <>
      <div
        className={clsx(
          "pb-3 mt-4 lg:block lg:pb-0 lg:mt-0",
          navbar ? "p-2 lg:p-0 block" : "hidden"
        )}>
        <ul className="h-screen lg:h-auto lg:flex lg:items-center lg:justify-center">
          {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              href={item.href}
              text={item.text}
              onClick={toggleOpen}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default Menu;
