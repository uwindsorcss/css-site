"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { PiSignOutBold } from "react-icons/pi";

function SignOutButton() {
  return (
    <Button
      size="icon"
      variant="destructive"
      onClick={() => {
        signOut();
      }}>
      <PiSignOutBold className="text-md" />
    </Button>
  );
}

export default SignOutButton;
