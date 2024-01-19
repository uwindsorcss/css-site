import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export function AddUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"full"} className="flex gap-2 items-center">
          <UserPlus size={20} />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription> Add a new user to the staff team.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-start mt-4">
          <Label htmlFor="email" className="text-right">
            UWindsor Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="user@uwindsor.ca"
            className="col-span-3"
            required
          />
        </div>
        <DialogFooter>
          <Button type="submit">Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
