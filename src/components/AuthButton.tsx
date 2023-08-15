"use client";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import React from "react";

function SignInButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Sign out
      </button>
    );
  }
  return (
    <button
      onClick={() => signIn("discord")}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Sign in
    </button>
  );
}

export default SignInButton;
