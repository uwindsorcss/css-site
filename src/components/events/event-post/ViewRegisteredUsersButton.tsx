import { Button } from "@/components/ui/button";
import { Clipboard, User } from "lucide-react";
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
import CopyButton from "@/components/ui/copy-button";
import { Session } from "next-auth";

interface RegistrationButtonProps {
  session: Session | null;
  eventID: number;
}

export default async function ViewRegisteredUsersButton({
  session,
  eventID,
}: RegistrationButtonProps) {
  const event = await prisma.event.findUnique({
    where: { id: eventID },
    include: {
      EventRegistration: { include: { user: true } },
    },
  });
  const count = event?.EventRegistration?.length || 0;
  const title = `Registered Users (${count})`;

  const UsersCountComponent = () => (
    <Button>
      <User className="w-5 h-5 mr-1" />
      {`${count}${event?.capacity !== null ? `/${event?.capacity}` : ""}`}
    </Button>
  );

  const generateUserList = () =>
    event?.EventRegistration.map(({ user: { name, email } }) => `${name} <${email}>`).join(",\n") ||
    "";

  if (!session || !canEditEvent(session)) return <UsersCountComponent />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <UsersCountComponent />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {title}
            {count !== 0 && (
              <CopyButton
                string={generateUserList()}
                size="sm"
                variant="ghost"
                className="ml-2 text-muted-foreground"
                label="Copy List"
                Icon={<Clipboard className="w-5 h-5" />}
              />
            )}
          </DialogTitle>
        </DialogHeader>
        {count === 0 ? (
          <h2 className="text-center text-muted-foreground text-sm m-20">No Users Registered</h2>
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
                {event?.EventRegistration.map(({ id, user, timestamp }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>{user.name}</TooltipTrigger>
                        <TooltipContent>{user.email}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>{formatShortDate(timestamp)}</TooltipTrigger>
                        <TooltipContent>{formatTimeDifference(timestamp)}</TooltipContent>
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
}
