import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export default async function Home(req: NextRequest) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">CSS Site</h1>
      {session ? (
        <>
          <span className="text-xl">Welcome, {session.user?.name}</span>
          <SignOutButton />
        </>
      ) : (
        <>
          <span className="text-xl">Please Sign In</span>
          <div className="flex gap-4">
            <SignInButton text="Sign in with Azure AD" />
          </div>
        </>
      )}
    </div>
  );
}
