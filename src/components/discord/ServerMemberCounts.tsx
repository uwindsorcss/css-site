import { getMemberCount } from "@/lib/actions";
import MemberCount from "./MemberCount";

interface ServerMemberCountsProps {
  cardInfo: {
    memberCountText: string;
    onlineCountText: string;
  };
}

async function ServerMemberCounts({ cardInfo }: ServerMemberCountsProps) {
  const { memberCount, onlineCount } = await getMemberCount();
  return (
    <>
      <MemberCount
        ping
        count={memberCount}
        text={cardInfo.memberCountText}
        className="text-sm text-foreground"
      />
      <MemberCount
        ping
        count={onlineCount}
        text={cardInfo.onlineCountText}
        className="text-sm text-foreground"
      />
    </>
  );
}

export default ServerMemberCounts;
