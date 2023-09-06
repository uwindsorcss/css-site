"use client";

import Link from "next/link";

import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface MenuItemProps {
  links: Link[];
}

function Menu({ links }: MenuItemProps) {
  return (
    <div className="hidden lg:flex h-auto items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((link, id) =>
            link.sublinks ? (
              <NavigationMenuItem key={id}>
                <NavigationMenuTrigger>{link.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {link.sublinks.map((sublink) => (
                      <ListItem key={sublink.name} title={sublink.name} href={sublink.href}>
                        {sublink.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={id}>
                <Link href={link.href} className={navigationMenuTriggerStyle()}>
                  {link.name}
                </Link>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default Menu;
