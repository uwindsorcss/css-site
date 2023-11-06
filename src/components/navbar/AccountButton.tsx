"use client";
import { signIn, signOut } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Role } from "@prisma/client";
import { camelCaseToTitleCase } from "@/lib/utils";

function AccountButton({ session }: { session: Session | null }) {
  const name: string = session?.user?.name ?? "user";
  const initials = (name?.split(" ") ?? [])
    .slice(0, 2)
    .map((name) => name[0])
    .join("");
  const role = session?.user?.role ?? "user";
  const title = session?.user?.title ?? "Student";

  if (session)
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={session.user.image ?? ""}
              alt={name}
              className="hover:brightness-90 transition-all"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="flex items-center px-2 py-2">
            <User className="w-5 h-5" />
            <div>
              <DropdownMenuLabel className="pb-0">{name}</DropdownMenuLabel>
              <div className="px-2 text-sm font-semibold text-gray-500">
                {role !== Role.user ? camelCaseToTitleCase(role) : title}
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
    <>
      <Button className="flex md:hidden" size="icon" variant={"outline"} onClick={() => signIn()}>
        <User className="w-4 h-4" />
      </Button>
      <Button className="hidden md:flex" variant={"outline"} onClick={() => signIn()}>
        <User className="w-4 h-4 mr-2" />
        <span>Sign In</span>
      </Button>
    </>
  );
}

export default AccountButton;
