"use client";

import { X } from "lucide-react";

interface DismissBannerButtonProps {
  dismissalCookieId: string;
  dismissBanner: (dismissalCookieId: string) => void;
}

function DismissBannerButton({ dismissBanner, dismissalCookieId }: DismissBannerButtonProps) {
  return (
    <button
      className="absolute top-0 bottom-0 right-8 my-auto text-primary-foreground hover:text-gray-200"
      onClick={() => dismissBanner(dismissalCookieId)}>
      <X size={24} />
    </button>
  );
}

export default DismissBannerButton;
