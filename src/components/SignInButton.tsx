"use client";
import { signIn } from "next-auth/react";
import React from "react";

interface SignInButtonProps {
  text: string;
}

function SignInButton({ text }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn("azure-ad")}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {text}
    </button>
  );
}

export default SignInButton;
