import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { HelpCircle } from "lucide-react";
import CSSIcon from "@/components/discord/CSSIcon";
import discordContent from "./content.json";
import { Metadata } from "next";
import DiscordMemberCounts from "@/components/discord/DiscordMemberCounts";
import ServerCardContent from "@/components/discord/DiscordCardContent";

export const metadata: Metadata = {
  title: "Discord",
};

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
          className="text-foreground hover:underline">
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

async function DiscordPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col justify-center sm:items-center">
      <Card className="min-sm:max-w-[400px] p-3 sm:w-[400px]">
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <HelpCircle className="text-muted-foreground hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="flex flex-col gap-4 space-y-1 text-sm text-muted-foreground">
                  {parseTextWithLinks(discordContent.hoverCardText)}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardHeader className="p-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <CSSIcon />
            <div className="mx-2 h-10 w-px rounded-full bg-border" />
            <SiDiscord className="h-10 w-10" />
          </div>
          <CardTitle className="flex flex-col items-center justify-center gap-2">
            <span className="text-center text-xl font-semibold">
              {discordContent.cardInfo.title}
            </span>
            <div className="flex flex-wrap justify-center gap-5">
              <DiscordMemberCounts cardInfo={discordContent.cardInfo} />
            </div>
          </CardTitle>
        </CardHeader>
        <ServerCardContent cardInfo={discordContent.cardInfo} />
      </Card>
    </div>
  );
}

export default DiscordPage;
