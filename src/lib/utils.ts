import { type ClassValue, clsx } from "clsx";
import { Session } from "next-auth";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";
import { DateFormatter } from "@internationalized/date";
import { RedirectType, redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const signIn = () => nextAuthSignIn("azure-ad");

export const checkUserRole = (session: Session, roles: Role[]): boolean =>
  roles.includes(session.user.role);

export const isAdmin = (session: Session): boolean => checkUserRole(session, [Role.admin]);
export const isMod = (session: Session): boolean => checkUserRole(session, [Role.mod]);
export const isModOrAdmin = (session: Session): boolean =>
  checkUserRole(session, [Role.mod, Role.admin]);
export const isUndergradStudent = (session: Session) => session.user.title === "Undergrad Student";

export const canEditEvent = (session: Session): boolean =>
  checkUserRole(session, [Role.eventEditor, Role.mod, Role.admin]);

export const canEditPost = (session: Session): boolean =>
  checkUserRole(session, [Role.postEditor, Role.mod, Role.admin]);

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const camelCaseToTitleCase = (s: string) => {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const isDateInPast = (date: Date) => date.getTime() < Date.now();
export const isDateInFuture = (date: Date) => date.getTime() > Date.now();
export const isWithinDateRange = (start: Date, end: Date) => {
  const now = new Date();
  return start <= now && end >= now;
};

export const getRelativeTimeDiff = (date: Date): string => {
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

export const getRelativeEventTime = (startDate: Date, endDate: Date) => {
  const now = new Date();
  if (startDate <= now && endDate >= now) return "Currently Happening";
  else if (startDate > now) return getRelativeTimeDiff(startDate);
  return getRelativeTimeDiff(endDate);
};

export const shortDateFormatter = new DateFormatter("en-US", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const dateFormatter = new DateFormatter("en-US", {
  timeZone: "America/Toronto",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const timeFormatter = new DateFormatter("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export const formatDateRange = (start: Date, end: Date) => {
  const isSameDay =
    start.toLocaleDateString("en-US", { timeZone: "America/Toronto" }) ===
    end.toLocaleDateString("en-US", { timeZone: "America/Toronto" });
  const startDateFormatted = dateFormatter.format(start);
  const startTimeFormatted = timeFormatter.format(start);
  const endTimeFormatted = timeFormatter.format(end);

  if (isSameDay) return `${startDateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;

  const endDateFormatted = dateFormatter.format(end);
  return `${startDateFormatted}, ${startTimeFormatted} - ${endDateFormatted}, ${endTimeFormatted}`;
};

export const formatShortDateRange = (start: Date, end: Date) =>
  `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
export const formatShortDate = (date: Date) => shortDateFormatter.format(date);
export const formatDate = (date: Date) => dateFormatter.format(date);

export enum ToastType {
  error = "error",
  success = "success",
}

export const toast = (type: ToastType, message: string, destination = "", redirectToUrl = true) => {
  if (!redirectToUrl) return `${destination}?${type}=${encodeURIComponent(message)}`;
  return redirect(`${destination}?${type}=${encodeURIComponent(message)}`, RedirectType.replace);
};

export const error = (message: string, destination = "", redirectToUrl = true) =>
  toast(ToastType.error, message, destination, redirectToUrl);

export const success = (message: string, destination = "", redirectToUrl = true) =>
  toast(ToastType.success, message, destination, redirectToUrl);

export const toastRes = (type: ToastType, message: string, destination = "") =>
  NextResponse.redirect(
    `${process.env.NEXTAUTH_URL}${destination}?${type}=${encodeURIComponent(message)}`
  );

export const errorRes = (message: string, destination = "") =>
  toastRes(ToastType.error, message, destination);

export const successRes = (message: string, destination = "") =>
  toastRes(ToastType.success, message, destination);

export const handleServerActionError = (error: Error, name: string) => {
  if (error.message === "NEXT_REDIRECT") throw error;
  console.error(`An error occurred from (${name}): `, error);
};
