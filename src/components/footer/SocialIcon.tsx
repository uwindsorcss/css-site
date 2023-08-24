import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface SocialIconProps {
  href: string;
  icon: any;
}

const SocialIcon = ({ href, icon }: SocialIconProps) => {
  return (
    <Button variant="ghost" size="icon">
      <Link target="_blank" rel="noopener noreferrer" href={href}>
        {React.createElement(icon, { className: "w-5 h-5" })}
      </Link>
    </Button>
  );
};

export default SocialIcon;
