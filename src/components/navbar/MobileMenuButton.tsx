"use client";

import { useCycle } from "framer-motion";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
const MobileMenu = dynamic(() => import("./MobileMenu"), { ssr: false });

function MobileMenuButton() {
  const [open, cycleOpen] = useCycle(false, true);

  return (
    <div className="lg:hidden">
      <Button variant="outline" size="icon" onClick={() => cycleOpen()}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <MobileMenu open={open} toggleOpen={() => cycleOpen()} />
    </div>
  );
}

export default MobileMenuButton;
