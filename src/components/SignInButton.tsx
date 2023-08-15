"use client";
import { signIn } from "next-auth/react";
import React from "react";

interface SignInButtonProps {
  text: string;
  provider: string;
}

function SignInButton({ text, provider }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn(provider)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {text}
    </button>
  );
}

export default SignInButton;
