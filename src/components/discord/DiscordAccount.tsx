import type { DiscordAccount } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUpdatedDiscordAccount } from "@/lib/actions";

interface DiscordAccountProps {
  account: DiscordAccount;
}

async function DiscordAccount({ account }: DiscordAccountProps) {
  const { username, avatarUrl } = await getUpdatedDiscordAccount(account);

  return (
    <div className="mt-2 inline-flex items-center gap-2 font-semibold text-foreground">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={"Discord Avatar"} />
        <AvatarFallback className="skeleton-card h-full w-full" />
      </Avatar>
      {username}
    </div>
  );
}

export default DiscordAccount;
