import { type ClassValue, clsx } from "clsx";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";

async function getSession() {
  return await getServerSession(authOptions);
}

function checkUserRole(session: Session, roles: Role[]): boolean {
  return roles.includes(session.user.role);
}

const isAdmin = (session: Session): boolean => checkUserRole(session, [Role.admin]);
const isMod = (session: Session): boolean => checkUserRole(session, [Role.mod]);
const isModOrAdmin = (session: Session): boolean => checkUserRole(session, [Role.mod, Role.admin]);

const canEditEvent = (session: Session): boolean =>
  checkUserRole(session, [Role.eventEditor, Role.mod, Role.admin]);
const canEditPost = (session: Session): boolean =>
  checkUserRole(session, [Role.postEditor, Role.mod, Role.admin]);

function isUndergradStudent(session: Session) {
  const user = session.user;
  return user.title === "Undergrad Student";
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function camelCaseToTitleCase(s: string) {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const isDateInPast = (date: Date) => date.getTime() < Date.now();
const isDateInFuture = (date: Date) => date.getTime() > Date.now();
const isWithinDateRange = (start: Date, end: Date) => {
  const now = new Date();
  return start <= now && end >= now;
};

function formatTimeDifference(date: Date) {
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

const dateFormatter = new Intl.DateTimeFormat("en-US", {
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

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

function formatDateRange(start: Date, end: Date) {
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

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

function formatShortDate(date: Date) {
  return shortDateFormatter.format(date);
}

const getEventRelativeTime = (startDate: Date, endDate: Date) => {
  const now = new Date();
  if (startDate <= now && endDate >= now) return "Currently Happening";
  else if (startDate > now) return formatTimeDifference(startDate);
  return formatTimeDifference(endDate);
};

export {
  getSession,
  canEditEvent,
  canEditPost,
  isUndergradStudent,
  cn,
  camelCaseToTitleCase,
  isDateInPast,
  isDateInFuture,
  isWithinDateRange,
  formatTimeDifference,
  formatDateRange,
  formatDate,
  formatShortDate,
  getEventRelativeTime,
  timeFormatter,
};
