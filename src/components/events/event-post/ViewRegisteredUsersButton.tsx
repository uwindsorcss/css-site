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
import { formatDate, formatShortenedTimeDistance } from "@/lib/utils";

interface RegistrationButtonProps {
  eventID: number;
}

export default async function ViewRegisteredUsersButton({ eventID }: RegistrationButtonProps) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <User className="w-5 h-5 mr-1" />{" "}
          {`${count}${event?.capacity !== null ? `/${event?.capacity}` : ""}`}
        </Button>
      </DialogTrigger>
      <DialogContent className={"overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {count === 0 ? (
          <h2 className="text-center text-muted-foreground text-sm mt-8">No users registered</h2>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event?.EventRegistration.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>{registration.user.name}</TableCell>
                  <TableCell>
                    {`${formatDate(registration.timestamp)} (${formatShortenedTimeDistance(
                      registration.timestamp
                    )})`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
