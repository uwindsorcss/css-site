"use server";

import { prisma } from "@/lib/db";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function unlinkDiscordAccount() {
  const session = await getServerSession(authOptions);
  await prisma.discordAccount
    .delete({
      where: {
        userId: session?.user?.id!,
      },
    })
    .then(() => {
      console.log("Successfully unlinked Discord account");
    })
    .catch((error) => {
      console.error("Failed to unlink Discord account:", error);
    });

  revalidatePath("/");
}
