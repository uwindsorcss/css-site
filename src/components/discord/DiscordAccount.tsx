import { DiscordAccount } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getUpdatedDiscordAccount } from "@/app/_actions";
import Image from "next/image";

interface DiscordAccountProps {
  account: DiscordAccount;
}

async function DiscordAccount({ account }: DiscordAccountProps) {
  const { username, avatarUrl } = await getUpdatedDiscordAccount(account);

  return (
    <div className="inline-flex font-semibold text-foreground items-center gap-2 mt-2">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={"Discord Avatar"} className="w-6 h-6 mr-2" />
        <AvatarFallback>
          <Image src={"/images/discord-avatar.png"} alt={"Discord Avatar"} fill />
        </AvatarFallback>
      </Avatar>
      {username}
    </div>
  );
}

export default DiscordAccount;
