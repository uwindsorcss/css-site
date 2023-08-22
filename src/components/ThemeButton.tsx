"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { Button } from "./ui/button";

const ThemeButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {mounted && resolvedTheme === "dark" ? (
        <BsFillSunFill className="h-4 w-4" />
      ) : (
        <BsFillMoonFill className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeButton;
