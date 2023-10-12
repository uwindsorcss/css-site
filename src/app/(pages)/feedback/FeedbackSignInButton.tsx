"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

function FeedbackSignInButton() {
  return (
    <div className="w-full flex justify-center">
      <Button className="w-full md:w-auto" onClick={() => signIn("azure-ad")}>
        Sign In to Leave Feedback
      </Button>
    </div>
  );
}

export default FeedbackSignInButton;
