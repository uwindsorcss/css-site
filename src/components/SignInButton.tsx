"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

interface SignInButtonProps {
  text: string;
}

function SignInButton({ text }: SignInButtonProps) {
  return (
    <Button
      onClick={() => {
        signIn("azure-ad");
      }}>
      {text}
    </Button>
  );
}

export default SignInButton;
