"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

function SignOutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() => {
        signOut();
      }}>
      Sign Out
    </Button>
  );
}

export default SignOutButton;
