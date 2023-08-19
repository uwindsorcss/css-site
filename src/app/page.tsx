import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LinkDiscordButton from "@/components/LinkDiscordButton";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import UnlinkDiscordButton from "@/components/UnlinkDiscordButton";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export default async function Home(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const discordAccount = await prisma.discordAccount.findFirst({
    where: { userId: session?.user?.id },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">CSS Site</h1>
      {session ? (
        <>
          <span className="text-xl">Welcome, {session.user?.name}</span>
          <span className="text-xl">
            {discordAccount
              ? `Discord: ${discordAccount.username}`
              : "Discord: Not Linked"}
          </span>
          <div className="flex gap-4">
            {discordAccount ? <UnlinkDiscordButton /> : <LinkDiscordButton />}
            <SignOutButton />
          </div>
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
