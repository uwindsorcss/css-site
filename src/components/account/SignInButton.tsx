"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { PiSignInBold } from "react-icons/pi";

function SignInButton() {
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        signIn("azure-ad");
      }}>
      <PiSignInBold className="text-md" />
    </Button>
  );
}

export default SignInButton;
