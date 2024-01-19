import { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { camelCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";

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
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <Table className="w-full max-w-4xl mx-auto">
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
                            <TableCell>{camelCaseToTitleCase(user.role)}</TableCell>
                            <TableCell className="flex gap-2 text-right justify-end">
                                <Button variant={"outline"} size={"icon"} disabled={user.role === "admin"}>
                                    <Pencil size={16} />
                                </Button>
                                <Button variant={"destructive"} size={"icon"} disabled={user.role === "admin"}>
                                    <X size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}