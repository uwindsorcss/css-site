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
    }, 5000);
  };

  return (
    <Button onClick={() => copyToClipboard()} className={className} size={size} variant={variant}>
      {Icon && isCopied ? <Check className="w-5 h-5" /> : Icon}
      <span className="hidden sm:inline text-sm ml-1">{isCopied ? "Copied!" : label}</span>
    </Button>
  );
}

export default CopyButton;
