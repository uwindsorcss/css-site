"use client";

import Link from "next/link";
import React from "react";

interface MenuItemProps {
  href: string;
  text: string;
  onClick: () => void;
}

function MenuItem({ href, text, onClick }: MenuItemProps) {
  return (
    <li className="text-sm lg:text-md text-center border-b-2 h-14 lg:h-10 mr-1 lg:rounded-md font-medium lg:border-b-0 border-border-900 hover:bg-accent hover:text-accent-foreground transition-colors">
      <Link
        className="flex items-center h-full w-full px-2 lg:px-4"
        href={href}
        onClick={onClick}>
        {text}
      </Link>
    </li>
  );
}

export default MenuItem;
