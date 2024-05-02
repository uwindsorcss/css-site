"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface DismissBannerButtonProps {
  dismissalCookieId: string;
  dismissBanner: (dismissalCookieId: string) => void;
}

function DismissBannerButton({ dismissBanner, dismissalCookieId }: DismissBannerButtonProps) {
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    const banner = document.getElementById(dismissalCookieId);
    if (banner && !isShown) banner.style.display = "none";
  }, [isShown, dismissalCookieId]);

  const handleDismiss = () => {
    setIsShown(false);
    dismissBanner(dismissalCookieId);
  };

  return isShown ? (
    <button className="p-1 text-primary-foreground hover:text-gray-200" onClick={handleDismiss}>
      <X size={24} />
    </button>
  ) : null;
}

export default DismissBannerButton;
