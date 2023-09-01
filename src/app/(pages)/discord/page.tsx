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
import { getMemberCount } from "@/app/_actions";
import MemberCount from "@/components/discord/MemberCount";
import discordContent from "./content.json";

export const metadata: Metadata = {
  title: "Discord",
};

export default async function DiscordPage() {
  const session = await getServerSession(authOptions);
  const discordAccount = await prisma.discordAccount.findFirst({
    where: { userId: session?.user?.id },
  });

  const { memberCount, onlineCount } = await getMemberCount();

  return (
    <div className="mt-48">
      <Card className="sm:w-[400px] min-sm:max-w-[400px] p-3 m-3">
        <div className="flex justify-end">
          <HoverCard>
            <HoverCardTrigger asChild>
              <HelpCircle className="text-muted-foreground" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="flex flex-col gap-4 text-sm text-muted-foreground space-y-1">
                  {parseTextWithLinks(discordContent.hoverCardText)}
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
                <span className="font-semibold">
                  Account: {discordAccount.username}
                </span>
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
    const parts = [];

    lines.forEach((line, lineIndex) => {
      let lastIndex = 0;

      line.replace(linkRegex, (match, linkText, linkUrl, index) => {
        const beforeText = line.substring(lastIndex, index);

        if (beforeText)
          parts.push(
            <span key={`${lineIndex}-before-${index}`}>{beforeText}</span>
          );

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
        parts.push(
          <span key={`${lineIndex}-remaining`}>
            {line.substring(lastIndex)}
          </span>
        );

      if (lineIndex < lines.length - 1)
        parts.push(<br key={`line-break-${lineIndex}`} />);
    });

    return <span>{parts}</span>;
  }
}
