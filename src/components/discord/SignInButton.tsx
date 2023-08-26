"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

function SignInButton() {
  return (
    <Button size="full" onClick={() => signIn("azure-ad")}>
      Sign In
    </Button>
  );
}

export default SignInButton;
