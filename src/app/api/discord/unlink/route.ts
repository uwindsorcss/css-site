import { NextResponse } from "next/server";
import { unlinkDiscordAccount } from "@/app/_actions";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  try {
    const unlikeDiscordAccount = await unlinkDiscordAccount();
    if (unlikeDiscordAccount) {
      revalidatePath("/discord");
      return NextResponse.redirect(
        new URL(
          "/discord?success=Your%20account%20has%20been%20unlinked.",
          req.url
        )
      );
    } else {
      return NextResponse.redirect(
        new URL(
          "/discord?error=There%20was%20an%20error%20linking%20your%20account.%20Please%20try%20again.",
          req.url
        )
      );
    }
  } catch (error) {
    console.error("Error handling Discord callback:", error);
    return NextResponse.redirect(
      new URL(
        "/discord?error=There%20was%20an%20error%20linking%20your%20account.%20Please%20try%20again.",
        req.url
      )
    );
  }
}
