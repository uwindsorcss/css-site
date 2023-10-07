"use client";

import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

function CopyListButton({ list }: { list: string }) {
  const [copied, setCopied] = useState(false);
  const copyList = () => {
    navigator.clipboard.writeText(list);
    setCopied(true);
  };

  return (
    <Button
      onClick={() => copyList()}
      className="ml-2 text-muted-foreground"
      size="sm"
      variant="ghost">
      {copied ? <Check className="w-5 h-5 mr-1" /> : <Clipboard className="w-5 h-5 mr-1" />}
      <span className="hidden sm:inline text-sm">{copied ? "Copied!" : "Copy List"}</span>
    </Button>
  );
}

export default CopyListButton;
