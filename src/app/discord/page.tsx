import DiscordAuthButton from "@/components/discord/DiscordAuthButton";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { HelpCircle } from "lucide-react";
import CSSIcon from "@/components/discord/CSSIcon";
import SignInButton from "@/components/discord/SignInButton";
import { getMemberCount } from "@/lib/actions";
import MemberCount from "@/components/discord/MemberCount";
import discordContent from "./content.json";
import { Metadata } from "next";
import DiscordAccount from "@/components/discord/DiscordAccount";
import { getSession } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Discord",
};

export default async function DiscordPage() {
  const session = await getSession();
  const discordAccount = await prisma.discordAccount.findFirst({
    where: { userId: session?.user?.id },
  });

  const { memberCount, onlineCount } = await getMemberCount();

  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-screen gap-10 px-4 md:px-8 py-32 max-w-7xl">
      <Card className="sm:w-[400px] min-sm:max-w-[400px] p-3 m-3">
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <HelpCircle className="text-muted-foreground hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="flex flex-col gap-4 text-sm text-muted-foreground space-y-1">
                  {parseTextWithLinks(discordContent.hoverCardText)}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CSSIcon />
            <div className="h-10 w-px bg-border mx-2 rounded-full" />
            <SiDiscord className="w-10 h-10" />
          </div>
          <CardTitle className="flex flex-col justify-center items-center gap-2">
            <span className="text-xl font-semibold text-center">
              {discordContent.cardInfo.title}
            </span>
            <div className="flex gap-4">
              <MemberCount
                ping
                count={memberCount}
                text={discordContent.cardInfo.memberCountText}
                className="text-sm text-foreground"
              />
              <MemberCount
                ping
                count={onlineCount}
                text={discordContent.cardInfo.onlineCountText}
                className="text-sm text-foreground"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-1 text-muted-foreground text-center text-sm">
          {session ? (
            discordAccount && discordAccount !== null ? (
              <>
                {discordContent.cardInfo.linkedAccountText}
                <DiscordAccount account={discordAccount} />
              </>
            ) : (
              discordContent.cardInfo.linkingAccountText
            )
          ) : (
            discordContent.cardInfo.notLoggedInText
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

  function parseTextWithLinks(text: string) {
    const linkRegex = /\[([^[]+)]\(([^)]+)\)/g;
    const lines = text.split("\n");
    const parts: JSX.Element[] = [];

    lines.forEach((line, lineIndex) => {
      let lastIndex = 0;

      line.replace(linkRegex, (match, linkText, linkUrl, index) => {
        const beforeText = line.substring(lastIndex, index);

        if (beforeText) parts.push(<span key={`${lineIndex}-before-${index}`}>{beforeText}</span>);

        parts.push(
          <a
            key={`${lineIndex}-${index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-foreground">
            {linkText}
          </a>
        );

        lastIndex = index + match.length;
        return match;
      });

      if (lastIndex < line.length)
        parts.push(<span key={`${lineIndex}-remaining`}>{line.substring(lastIndex)}</span>);

      if (lineIndex < lines.length - 1) parts.push(<br key={`line-break-${lineIndex}`} />);
    });

    return <span>{parts}</span>;
  }
}
