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
import { canEditEvent, formatShortDate, getRelativeTimeDiff } from "@/lib/utils";
import CopyButton from "@/components/ui/copy-button";
import { Session } from "next-auth";
import clsx from "clsx";

interface RegistrationButtonProps {
  session: Session | null;
  eventID: number;
}

function UserRow({ user, timestamp }: { user: any; timestamp: Date }) {
  return (
    <TableRow>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>{user.name}</TooltipTrigger>
          <TooltipContent>{user.email}</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>{formatShortDate(timestamp)}</TooltipTrigger>
          <TooltipContent>{getRelativeTimeDiff(timestamp)}</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function UsersCountComponent({
  session,
  count,
  capacity,
}: {
  session?: Session | null;
  count: number;
  capacity: number | null;
}) {
  return (
    <Button className={clsx(!session && "cursor-auto")}>
      <User className="w-5 h-5 mr-1" />
      {`${count}${capacity !== null ? ` / ${capacity}` : ""}`}
    </Button>
  );
}

function UserRegistrationTable({
  registrations,
  isOverCapacity,
  capacity,
}: {
  registrations: any[];
  isOverCapacity: boolean;
  capacity: number | null;
}) {
  if (registrations.length === 0) {
    return <h2 className="text-center text-muted-foreground text-sm m-20">No Users Registered</h2>;
  }

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Registered At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TooltipProvider>
          {(isOverCapacity && capacity !== null
            ? registrations.slice(0, capacity)
            : registrations
          ).map(({ id, user, timestamp }) => (
            <UserRow key={id} user={user} timestamp={timestamp} />
          ))}
          {isOverCapacity && capacity !== null && (
            <>
              <h1 className="px-4 pt-4 mt-4 text-lg font-medium text-foreground">Waitlist</h1>
              {registrations.slice(capacity).map(({ id, user, timestamp }) => (
                <UserRow key={id} user={user} timestamp={timestamp} />
              ))}
            </>
          )}
        </TooltipProvider>
      </TableBody>
    </Table>
  );
}

export default async function ViewRegisteredUsersButton({
  session,
  eventID,
}: RegistrationButtonProps) {
  const event = await prisma.event.findUnique({
    where: { id: eventID },
    include: {
      EventRegistration: {
        include: { user: true },
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (event === null) return null;

  const capacity = event.capacity;
  const count = event.EventRegistration.length;
  const isOverCapacity = capacity !== null && count > capacity;
  const title = `Registered Users (${count})`;

  if (!session || !canEditEvent(session))
    return <UsersCountComponent session={session} count={count} capacity={capacity} />;

  const generateUserList = () => {
    if (count === 0) return "";

    if (isOverCapacity) {
      return event.EventRegistration.slice(0, capacity)
        .map(({ user: { name, email } }) => `${name} <${email}>`)
        .join(",\n");
    }
    return event.EventRegistration.map(({ user: { name, email } }) => `${name} <${email}>`).join(
      ",\n"
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <UsersCountComponent session={session} count={count} capacity={capacity} />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto w-full max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            {title}
            {count > 0 && (
              <CopyButton
                string={generateUserList()}
                size="sm"
                variant="ghost"
                className="ml-2 text-muted-foreground"
                label="Copy List"
                Icon={<Clipboard size={18} className="mr-1" />}
              />
            )}
          </DialogTitle>
        </DialogHeader>
        <UserRegistrationTable
          registrations={event.EventRegistration}
          isOverCapacity={isOverCapacity}
          capacity={capacity}
        />
      </DialogContent>
    </Dialog>
  );
}
