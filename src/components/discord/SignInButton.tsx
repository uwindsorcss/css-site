"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn } from "@/lib/utils";

function SignInButton() {
  return (
    <Button size="full" onClick={() => signIn()}>
      Sign In
    </Button>
  );
}

export default SignInButton;
