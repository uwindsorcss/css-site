"use client";
import { signIn, signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function AccountButton({ session }: { session: Session | null }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("error") !== null) {
      const error = searchParams.get("error")?.replace(/([A-Z])/g, " $1");
      toast({
        title: "Error",
        description: error ?? "",
        variant: "destructive",
      });
      router.replace(path);
      router.refresh();
    } else if (searchParams.get("success") !== null) {
      toast({
        title: "Success",
        description: searchParams.get("success") ?? "",
        variant: "success",
      });
      router.replace(path);
      router.refresh();
    }
  }, [searchParams, path, router, toast]);

  if (session)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={session.user.image ?? ""}
              alt={session.user.name}
              className="hover:brightness-90 transition-all"
            />
            <AvatarFallback>
              {(session.user.name?.match(/\b(\w)/g) ?? []).join("")}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="flex items-center px-2 py-2">
            <User className="w-5 h-5" />
            <div>
              <DropdownMenuLabel className="pb-0">
                {session.user.name}
              </DropdownMenuLabel>
              <div className="px-2 text-sm font-semibold text-gray-500">
                {session?.user?.title ?? "User"}
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/discord">
                <SiDiscord className="w-4 h-4 mr-3" />
                <span>Discord Account</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="text-destructive mr-3 h-4 w-4" />
            <span className="text-destructive">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <Button size="icon" variant={"outline"} onClick={() => signIn("azure-ad")}>
      <LogIn className="w-4 h-4" />
    </Button>
  );
}

export default AccountButton;
