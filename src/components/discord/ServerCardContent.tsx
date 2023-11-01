import DiscordAuthButton from "@/components/discord/DiscordAuthButton";
import { prisma } from "@/lib/db";
import { CardContent, CardFooter } from "@/components/ui/card";
import SignInButton from "@/components/discord/SignInButton";
import DiscordAccount from "@/components/discord/DiscordAccount";
import { getSession } from "@/lib/utils";

interface ServerCardContentProps {
  cardInfo: {
    linkedAccountText: string;
    linkingAccountText: string;
    notLoggedInText: string;
  };
}

async function ServerCardContent({ cardInfo }: ServerCardContentProps) {
  const session = await getSession();
  const discordAccount = await prisma.discordAccount.findFirst({
    where: { userId: session?.user?.id },
  });

  return (
    <>
      <CardContent className="flex flex-col items-center justify-center gap-1 text-muted-foreground text-center text-sm">
        {session ? (
          discordAccount && discordAccount !== null ? (
            <>
              {cardInfo.linkedAccountText}
              <DiscordAccount account={discordAccount} />
            </>
          ) : (
            cardInfo.linkingAccountText
          )
        ) : (
          cardInfo.notLoggedInText
        )}
      </CardContent>
      <CardFooter className="flex w-full px-2 pb-2">
        {session && session !== null ? (
          <DiscordAuthButton linked={discordAccount !== null} />
        ) : (
          <SignInButton />
        )}
      </CardFooter>
    </>
  );
}

export default ServerCardContent;
