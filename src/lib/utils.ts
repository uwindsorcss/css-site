import { type ClassValue, clsx } from "clsx";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";

export async function getSession() {
  return await getServerSession(authOptions);
}

export function isModOrAdmin(session: Session) {
  const user = session.user;
  return user.role === Role.mod || user.role === Role.admin;
}

export function isAdmin(session: Session) {
  const user = session.user;
  return user.role === Role.admin;
}

export function isMod(session: Session) {
  const user = session.user;
  return user.role === Role.mod;
}

export function isUndergradStudent(session: Session) {
  const user = session.user;
  return user.title === "Undergrad Student";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function formatShortenedTimeDistance(date: Date) {
  const isFuture = date.getTime() > Date.now();
  const unit = isFuture ? "from now" : "ago";
  const diff = Math.abs(date.getTime() - Date.now()) / 1000;

  if (diff < 60) return "now";
  if (diff < 60 * 60) return `${Math.floor(diff / 60)} minute${diff < 120 ? "" : "s"} ${unit}`;
  if (diff < 60 * 60 * 24)
    return `${Math.floor(diff / (60 * 60))} hour${diff < 60 * 60 * 2 ? "" : "s"} ${unit}`;
  if (diff < 60 * 60 * 24 * 7)
    return `${Math.floor(diff / (60 * 60 * 24))} day${diff < 60 * 60 * 24 * 2 ? "" : "s"} ${unit}`;
  if (diff < 60 * 60 * 24 * 30)
    return `${Math.floor(diff / (60 * 60 * 24 * 7))} week${
      diff < 60 * 60 * 24 * 7 * 2 ? "" : "s"
    } ${unit}`;
  if (diff < 60 * 60 * 24 * 365)
    return `${Math.floor(diff / (60 * 60 * 24 * 30))} month${
      diff < 60 * 60 * 24 * 30 * 2 ? "" : "s"
    } ${unit}`;
  return `${Math.floor(diff / (60 * 60 * 24 * 365))} year${
    diff < 60 * 60 * 24 * 365 * 2 ? "" : "s"
  } ${unit}`;
}

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export function formatDateRange(start: Date, end: Date) {
  const isSameDay =
    start.toLocaleDateString("en-US", { timeZone: "America/Toronto" }) ===
    end.toLocaleDateString("en-US", { timeZone: "America/Toronto" });

  if (isSameDay)
    return `${dateFormatter.format(start)} from ${timeFormatter.format(
      start
    )} to ${timeFormatter.format(end)}`;

  return `${dateFormatter.format(start)} at ${timeFormatter.format(
    start
  )} to ${dateFormatter.format(end)} at ${timeFormatter.format(end)}`;
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function formatShortDate(date: Date) {
  return shortDateFormatter.format(date);
}

export const getEventRelativeTime = (startDate: Date, endDate: Date) => {
  const now = new Date();
  if (startDate <= now && endDate >= now) return "Currently Happening";
  else if (startDate > now) return formatShortenedTimeDistance(startDate);
  return formatShortenedTimeDistance(endDate);
};
