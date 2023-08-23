"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { Button } from "../ui/button";

interface ThemeButtonProps {
  className?: string;
}

const ThemeButton = ({ className }: ThemeButtonProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Button
      className={className}
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {mounted && resolvedTheme === "dark" ? (
        <BsFillSunFill className="text-md" />
      ) : (
        <BsFillMoonFill className="text-md" />
      )}
    </Button>
  );
};

export default ThemeButton;
