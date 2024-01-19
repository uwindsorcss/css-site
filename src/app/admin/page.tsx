import { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { camelCaseToTitleCase } from "@/lib/utils";
import { EditRoleDropdown } from "@/components/admin/EditRoleDropdown";
import { RemoveUserDialog } from "@/components/admin/RemoveUserDialog";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { Role } from "@prisma/client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const staff = await prisma.user.findMany({
    where: {
      role: {
        not: "user",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <h1 className="text-4xl text-center font-bold">Admin Dashboard</h1>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-6">
        <AddUserDialog />
        <Table className="mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    {camelCaseToTitleCase(user.role)}
                    <EditRoleDropdown disabled={user.role === Role.admin} currentRole={user.role} />
                  </div>
                </TableCell>
                <TableCell className="flex gap-2 text-right justify-end">
                  <RemoveUserDialog disabled={user.role === Role.admin} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
