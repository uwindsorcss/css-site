import { getMemberCount } from "@/lib/actions";
import AnimatedNumber from "../ui/animated-number";

interface DiscordMemberCountsProps {
  cardInfo: {
    memberCountText: string;
    onlineCountText: string;
  };
}

const StatusIndicator = ({ color, isPinging = false }: { color: string; isPinging?: boolean }) => (
  <div className="relative inline-flex items-center h-2 w-2 mr-1">
    <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
    {isPinging && (
      <span className={`absolute w-2 h-2 rounded-full animate-ping opacity-75 bg-${color}-500`} />
    )}
  </div>
);

const CountDisplay = ({
  color,
  countValue,
  countText,
  isPinging,
}: {
  color: string;
  countValue: number;
  countText: string;
  isPinging?: boolean;
}) => (
  <div className="inline-flex items-center text-center gap-1 text-sm text-foreground">
    <StatusIndicator color={color} isPinging={isPinging} />
    <AnimatedNumber value={countValue} />
    {countText}
  </div>
);

async function DiscordMemberCounts({ cardInfo }: DiscordMemberCountsProps) {
  const { memberCount, onlineCount } = await getMemberCount();

  return (
    <>
      <CountDisplay
        color="gray"
        countValue={memberCount}
        countText={cardInfo.memberCountText}
        isPinging={true}
      />
      <CountDisplay
        color="green"
        countValue={onlineCount}
        countText={cardInfo.onlineCountText}
        isPinging={true}
      />
    </>
  );
}

export default DiscordMemberCounts;
