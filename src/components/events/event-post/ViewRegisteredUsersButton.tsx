import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { canEditEvent, formatShortDate, formatTimeDifference } from "@/lib/utils";
import { Session } from "next-auth";
import CopyListButton from "./CopyListButton";

interface RegistrationButtonProps {
  session: Session | null;
  eventID: number;
}

export default async function ViewRegisteredUsersButton({
  session,
  eventID,
}: RegistrationButtonProps) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventID,
    },
    include: {
      EventRegistration: {
        include: {
          user: true,
        },
      },
    },
  });

  const count = event?.EventRegistration.length;
  const title = `Registered Users (${count})`;

  const usersCountComponent = (
    <Button>
      <User className="w-5 h-5 mr-1" />{" "}
      {`${count}${event?.capacity !== null ? `/${event?.capacity}` : ""}`}
    </Button>
  );

  const getUsersList = () => {
    let list = "";
    event?.EventRegistration.forEach((registration, index, array) => {
      list += `${registration.user.name} <${registration.user.email}>`;
      if (index < array.length - 1) {
        list += ",\n";
      }
    });
    return list;
  };

  if (session && session !== null && canEditEvent(session)) {
    return (
      <Dialog>
        <DialogTrigger asChild>{usersCountComponent}</DialogTrigger>
        <DialogContent className={"max-h-[80vh] overflow-y-auto w-full max-w-[700px]"}>
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              {title}
              {count !== 0 && <CopyListButton list={getUsersList()} />}
            </DialogTitle>
          </DialogHeader>
          {count === 0 ? (
            <h2 className="text-center text-muted-foreground text-sm mt-8">No users registered</h2>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Registered At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TooltipProvider>
                  {event?.EventRegistration.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>{registration.user.name}</TooltipTrigger>
                          <TooltipContent>{registration.user.email}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            {`${formatShortDate(registration.timestamp)}`}
                          </TooltipTrigger>
                          <TooltipContent>
                            {`${formatTimeDifference(registration.timestamp)}`}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TooltipProvider>
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    );
  } else {
    return <>{usersCountComponent}</>;
  }
}
