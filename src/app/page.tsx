import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthButton from "@/components/AuthButton";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export default async function Home(req: NextRequest) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <span className="text-4xl font-bold">
        {session ? `Hello, ${session?.user?.name}` : "You are not signed in"}
      </span>
      <AuthButton session={session} />
    </div>
  );
}
