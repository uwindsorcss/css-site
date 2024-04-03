import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { IconType } from "@icons-pack/react-simple-icons";

interface SocialIconProps {
  href: string;
  Icon: IconType;
}

const SocialIcon = ({ href, Icon }: SocialIconProps) => {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link target="_blank" rel="noopener noreferrer" href={href}>
        <Icon size={20} />
      </Link>
    </Button>
  );
};

export default SocialIcon;
