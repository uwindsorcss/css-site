import type { DiscordAccount } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUpdatedDiscordAccount } from "@/lib/actions";

interface DiscordAccountProps {
  account: DiscordAccount;
}

async function DiscordAccount({ account }: DiscordAccountProps) {
  const { username, avatarUrl } = await getUpdatedDiscordAccount(account);

  return (
    <div className="inline-flex font-semibold text-foreground items-center gap-2 mt-2">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatarUrl} alt={"Discord Avatar"} />
        <AvatarFallback className="w-full h-full skeleton-card" />
      </Avatar>
      {username}
    </div>
  );
}

export default DiscordAccount;
