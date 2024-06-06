import DiscordAuthButton from "@/components/discord/DiscordAuthButton";
import { prisma } from "@/lib/db";
import { CardContent, CardFooter } from "@/components/ui/card";
import SignInButton from "@/components/discord/SignInButton";
import DiscordAccount from "@/components/discord/DiscordAccount";
import { auth } from "@/auth";

interface ServerCardContentProps {
  cardInfo: {
    linkedAccountText: string;
    linkingAccountText: string;
    notLoggedInText: string;
  };
}

async function ServerCardContent({ cardInfo }: ServerCardContentProps) {
  const session = await auth();
  const discordAccount = await prisma.discordAccount.findFirst({
    where: { userId: session?.user?.id },
  });

  const DiscordAccountInfo = () => {
    if (!session) return <>{cardInfo.notLoggedInText}</>;
    if (!discordAccount) return <>{cardInfo.linkingAccountText}</>;
    return (
      <>
        {cardInfo.linkedAccountText}
        <DiscordAccount account={discordAccount} />
      </>
    );
  };

  return (
    <>
      <CardContent className="flex flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
        <DiscordAccountInfo />
      </CardContent>
      <CardFooter className="flex w-full px-2 pb-2">
        {session ? <DiscordAuthButton linked={!!discordAccount} /> : <SignInButton />}
      </CardFooter>
    </>
  );
}

export default ServerCardContent;
