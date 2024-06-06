import { getMemberCount } from "@/lib/actions";
import AnimatedNumber from "../ui/animated-number";

interface DiscordMemberCountsProps {
  cardInfo: {
    memberCountText: string;
    onlineCountText: string;
  };
}

const GreenPing = () => (
  <div className="relative mr-1 inline-flex h-2 w-2 items-center">
    <span className="h-2 w-2 rounded-full bg-green-500" />
    <span className="absolute h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75" />
  </div>
);

const GrayPing = () => (
  <div className="relative mr-1 inline-flex h-2 w-2 items-center">
    <span className="h-2 w-2 rounded-full bg-gray-500" />
    <span className="absolute h-2 w-2 animate-ping rounded-full bg-gray-500 opacity-75" />
  </div>
);

const CountDisplay = ({
  color,
  countValue,
  countText,
}: {
  color: string;
  countValue: number;
  countText: string;
  isPinging?: boolean;
}) => (
  <div className="inline-flex items-center gap-1 text-center text-sm text-foreground">
    {color === "green" ? <GreenPing /> : <GrayPing />}
    <AnimatedNumber value={countValue} />
    {countText}
  </div>
);

async function DiscordMemberCounts({ cardInfo }: DiscordMemberCountsProps) {
  const { memberCount, onlineCount } = await getMemberCount();

  return (
    <>
      <CountDisplay color="gray" countValue={memberCount} countText={cardInfo.memberCountText} />
      <CountDisplay color="green" countValue={onlineCount} countText={cardInfo.onlineCountText} />
    </>
  );
}

export default DiscordMemberCounts;
