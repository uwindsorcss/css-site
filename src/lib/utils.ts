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

export function isEventEditor(session: Session) {
  const user = session.user;
  return user.role === Role.eventEditor;
}

export function canEditEvent(session: Session) {
  const user = session.user;
  return user.role === Role.eventEditor || user.role === Role.mod || user.role === Role.admin;
}

export function isUndergradStudent(session: Session) {
  const user = session.user;
  return user.title === "Undergrad Student";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function camelCaseToTitleCase(s: string) {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatTimeDifference(date: Date) {
  const isFuture = date.getTime() > Date.now();
  const diff = Math.abs(date.getTime() - Date.now()) / 1000;

  if (diff < 60) return "now";

  const SECOND = 1;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  const timeUnits = [
    { label: "minute", value: MINUTE, max: HOUR },
    { label: "hour", value: HOUR, max: DAY },
    { label: "day", value: DAY, max: WEEK },
    { label: "week", value: WEEK, max: MONTH },
    { label: "month", value: MONTH, max: YEAR },
    { label: "year", value: YEAR, max: Infinity },
  ];

  for (const { label, value, max } of timeUnits) {
    if (diff < max) {
      const count = Math.floor(diff / value);
      return isFuture
        ? `In ${count} ${label}${count === 1 ? "" : "s"}`
        : `${count} ${label}${count === 1 ? "" : "s"} ago`;
    }
  }
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
  else if (startDate > now) return formatTimeDifference(startDate);
  return formatTimeDifference(endDate);
};
