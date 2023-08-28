import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DiscordAuthButton from "@/components/discord/DiscordAuthButton";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { HelpCircle } from "lucide-react";
import CSSIcon from "@/components/discord/CSSIcon";
import SignInButton from "@/components/discord/SignInButton";

export default async function DiscordPage() {
  const session = await getServerSession(authOptions);
  const discordAccount = await prisma.discordAccount.findFirst({
    where: { userId: session?.user?.id },
  });

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Card className="sm:w-[400px] min-sm:max-w-[400px] p-3 m-3">
        <div className="flex justify-end">
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="text-muted-foreground" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="flex flex-col gap-4 text-sm text-muted-foreground space-y-1">
                  <p>
                    <a
                      href="https://discord.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-foreground">
                      Discord
                    </a>
                    {
                      " is a free application that makes it easy to communicate between users in chat channels. Discord is available on the web, desktop, and mobile devices."
                    }
                  </p>
                  <p>
                    {
                      "The Computer Science Society created a private Discord server to connect Computer Science students and enable discussions for courses, co-op/internships, general chat and more."
                    }
                  </p>
                  <p>
                    {
                      "All users in the Discord server are linked to their UWindsor email addresses to verify identity and to restrict the server to UWindsor students only."
                    }
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CSSIcon />
            <div className="h-10 w-px bg-border mx-2 rounded-full" />
            <SiDiscord className="w-10 h-10" />
          </div>
          <CardTitle className="flex justify-center">
            <span className="text-xl font-semibold text-center">
              UWindsor Computer Science
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
          {session ? (
            <>
              {discordAccount && discordAccount !== null ? (
                <>
                  <span className="text-center text-sm">
                    Your Discord account is linked.
                  </span>
                  <span className="text-center font-semibold text-sm">
                    Account: {discordAccount.username}
                  </span>
                </>
              ) : (
                <span className="text-center text-sm">
                  Linking your Discord account will allow you to access the CSS
                  Discord server.
                </span>
              )}
            </>
          ) : (
            <span className="text-center text-sm">
              You're currently not logged in. Please log in to link your Discord
              account.
            </span>
          )}
        </CardContent>
        <CardFooter className="flex w-full px-2 pb-2">
          {session && session !== null ? (
            <DiscordAuthButton linked={discordAccount !== null} />
          ) : (
            <SignInButton />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
