import { type ClassValue, clsx } from "clsx";
import { Session, getServerSession } from "next-auth";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";
import { DateFormatter } from "@internationalized/date";

const getSession = async () => await getServerSession(authOptions);
const signIn = () => nextAuthSignIn("azure-ad");

const checkUserRole = (session: Session, roles: Role[]): boolean =>
  roles.includes(session.user.role);

const isAdmin = (session: Session): boolean => checkUserRole(session, [Role.admin]);
const isMod = (session: Session): boolean => checkUserRole(session, [Role.mod]);
const isModOrAdmin = (session: Session): boolean => checkUserRole(session, [Role.mod, Role.admin]);
const isUndergradStudent = (session: Session) => session.user.title === "Undergrad Student";

const canEditEvent = (session: Session): boolean =>
  checkUserRole(session, [Role.eventEditor, Role.mod, Role.admin]);

const canEditPost = (session: Session): boolean =>
  checkUserRole(session, [Role.postEditor, Role.mod, Role.admin]);

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const camelCaseToTitleCase = (s: string) => {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const isDateInPast = (date: Date) => date.getTime() < Date.now();
const isDateInFuture = (date: Date) => date.getTime() > Date.now();
const isWithinDateRange = (start: Date, end: Date) => {
  const now = new Date();
  return start <= now && end >= now;
};

const getRelativeTimeDiff = (date: Date): string => {
  const now = Date.now();
  const isFuture = date.getTime() > now;
  const diffInSeconds = Math.abs(date.getTime() - now) / 1000;

  if (diffInSeconds < 60) return "now";

  const timeUnits: [string, number][] = [
    ["year", 31536000], // 365 days
    ["month", 2592000], // 30 days
    ["week", 604800], // 7 days
    ["day", 86400], // 24 hours
    ["hour", 3600], // 60 minutes
    ["minute", 60],
  ];

  for (const [unit, secondsInUnit] of timeUnits) {
    if (diffInSeconds >= secondsInUnit) {
      const count = Math.floor(diffInSeconds / secondsInUnit);
      return isFuture
        ? `In ${count} ${unit}${count === 1 ? "" : "s"}`
        : `${count} ${unit}${count === 1 ? "" : "s"} ago`;
    }
  }
  return "";
};

const getRelativeEventTime = (startDate: Date, endDate: Date) => {
  const now = new Date();
  if (startDate <= now && endDate >= now) return "Currently Happening";
  else if (startDate > now) return getRelativeTimeDiff(startDate);
  return getRelativeTimeDiff(endDate);
};

const shortDateFormatter = new DateFormatter("en-US", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const dateFormatter = new DateFormatter("en-US", {
  timeZone: "America/Toronto",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const timeFormatter = new DateFormatter("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

const formatDateRange = (start: Date, end: Date) => {
  const isSameDay =
    start.toLocaleDateString("en-US", { timeZone: "America/Toronto" }) ===
    end.toLocaleDateString("en-US", { timeZone: "America/Toronto" });
  const startDateFormatted = dateFormatter.format(start);
  const startTimeFormatted = timeFormatter.format(start);
  const endTimeFormatted = timeFormatter.format(end);

  if (isSameDay) return `${startDateFormatted} from ${startTimeFormatted} to ${endTimeFormatted}`;

  const endDateFormatted = dateFormatter.format(end);
  return `${startDateFormatted} at ${startTimeFormatted} to ${endDateFormatted} at ${endTimeFormatted}`;
};

const formatShortDateRange = (start: Date, end: Date) =>
  `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
const formatShortDate = (date: Date) => shortDateFormatter.format(date);
const formatDate = (date: Date) => dateFormatter.format(date);

export {
  getSession,
  signIn,
  canEditEvent,
  canEditPost,
  isUndergradStudent,
  cn,
  camelCaseToTitleCase,
  isDateInPast,
  isDateInFuture,
  isWithinDateRange,
  getRelativeTimeDiff,
  formatDateRange,
  formatShortDateRange,
  formatDate,
  formatShortDate,
  getRelativeEventTime,
};
