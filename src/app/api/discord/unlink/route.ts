import { NextResponse } from "next/server";
import { unlinkDiscordAccount } from "@/app/_actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const unlikeDiscordAccount = await unlinkDiscordAccount();
    if (unlikeDiscordAccount) {
      revalidatePath("/discord");
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/discord?success=${encodeURIComponent(
          "Your account has been unlinked."
        )}`
      );
    }
    throw new Error("No discord account found. Please try again.");
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/discord?error=${encodeURIComponent(
        (error as Error).message
      ).trim()}`
    );
  }
}
