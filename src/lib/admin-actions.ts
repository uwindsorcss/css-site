"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { camelCaseToTitleCase, error, isAdmin, success } from "@/lib/utils";
import { Role } from "@prisma/client";

export async function removeUserFromStaff(userId: number) {
  const session = await auth();
  if (!session) return error("You're not logged in. Please log in and try again.", "/");

  if (!isAdmin(session)) return error("You're not authorized.", "/");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "The user you're trying to remove doesn't exist." };

  if (user.role === Role.user) return error(`${user.name} is not a staff member.`);

  await prisma.user.update({
    where: { id: userId },
    data: { role: Role.user },
  });

  if (user.id === session.user.id) return success("You've been removed from the staff team.", "/");

  return success(`${user.name} has been removed from the staff team.`);
}

export async function addUserToStaff(email: string, role: Role) {
  const session = await auth();
  if (!session) return error("You're not logged in. Please log in and try again.", "/");

  if (!isAdmin(session)) return error("You're not authorized.", "/");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return error("The user you're trying to add doesn't exist.");

  if (user.role !== Role.user)
    return error(`${user.name} is already a staff member, update their role instead.`);

  await prisma.user.update({
    where: { email },
    data: { role },
  });

  return success(`${user.name} has been added to the staff team.`);
}

export async function updateUserRole(userId: number, role: Role) {
  const session = await auth();
  if (!session) return error("You're not logged in. Please log in and try again.", "/");

  if (!isAdmin(session)) return error("You're not authorized.", "/");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return error("The user you're trying to update doesn't exist.");

  if (user.role === role)
    return error(`${user.name} is already has the ${camelCaseToTitleCase(role)} role.`);

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return success(`${user.name}'s role has been updated to ${camelCaseToTitleCase(role)}.`);
}
