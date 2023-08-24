"use client";
import { signIn, signOut } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { Session } from "next-auth";

function AuthButton({ session }: { session: Session | null }) {
  return (
    <Button
      size="icon"
      variant={session ? "destructive" : "outline"}
      onClick={() => {
        if (session) signOut();
        else signIn("azure-ad");
      }}>
      {session ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
    </Button>
  );
}

export default AuthButton;
