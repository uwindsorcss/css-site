"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ReactNode, useState } from "react";

interface CopyButtonProps {
  string: string;
  className?: string;
  label?: string;
  Icon: ReactNode;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "ghost" | "outline";
}

function CopyButton({
  string,
  className,
  label = "Copy",
  size = "default",
  variant = "default",
  Icon,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(string);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 8000);
  };

  return (
    <Button onClick={() => copyToClipboard()} className={className} size={size} variant={variant}>
      {Icon && isCopied ? <Check size={18} className="mr-1" /> : Icon}
      <span>{label}</span>
    </Button>
  );
}

export default CopyButton;
