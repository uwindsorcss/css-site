import Link from "next/link";
import MarkDownView from "@/components/views/MarkDownView";
import { formatDateRange, getRelativeEventTime, getRelativeTimeDiff, cn } from "@/lib/utils";
import { AlarmClock, CalendarDays, EyeOff, LucideIcon, MapPin, User } from "lucide-react";
import { Event, Post } from "@prisma/client";

interface PostWithAuthor extends Post {
  author?: { name: string };
}

interface ContentProps {
  post: Event | Post | PostWithAuthor;
  currentPage?: number;
  filter?: string;
  truncate?: boolean;
}

const markdownToTextWithNewLines = (markdown: string) => {
  return markdown
    .replace(/^.*#[^#\n].*$/gm, (match: string) => `\n${match}\n`) // headers
    .replace(/^\s*[\-*+]\s+/gm, "\n") // bullet list items
    .replace(/^\s*\d+\.\s+/gm, "\n") // ordered list items
    .replace(/  \n/gm, "\n"); // new lines (double space at end of line)
};

const isNewContent = (createdAt: Date) => {
  const currentUtcDate = new Date();
  const millisecondsIn3Days = 3 * 24 * 60 * 60 * 1000;
  const timeDifference = Math.abs(createdAt.getTime() - currentUtcDate.getTime());
  return timeDifference <= millisecondsIn3Days;
};

function PostCard({ post, currentPage, filter, truncate = false }: ContentProps) {
  const { id, title, createdAt } = post;
  const isEvent = "startDate" in post;
  const linkUrl = isEvent
    ? `/events/${post.id}?page=${currentPage}${filter ? `&filter=${filter}` : ""}`
    : `/highlight/${post.id}${currentPage ? `?page=${currentPage}` : ""}`;
  const banner = !isEvent && post.bannerUrl
    ? {
        url: post.bannerUrl ?? "",
        alt: post.bannerAlt ?? "Banner image for the highlight.",
      }
    : false;
  const content = isEvent ? post.description : post.content;
  const numOfLines: number = markdownToTextWithNewLines(content!).split("\n").length;
  const truncateContent = truncate && (content!.length > 400 || numOfLines > 5);

  return (
    <Link
      key={id}
      href={linkUrl}
      className="transition-border group relative flex w-full flex-col gap-2 rounded-md border border-border bg-card p-6 text-card-foreground duration-300 ease-in-out hover:border-gray-600 hover:bg-gray-200 dark:hover:bg-[#192236]">
      {/* Visibility and New Indicators */}
      {"visible" in post && !post.visible ? (
        <span className="absolute right-0 top-0 flex w-11 items-center justify-center rounded-bl rounded-tr bg-gray-500 px-2 py-1 text-xs font-bold text-white">
          <EyeOff size={16} />
        </span>
      ) : (
        isNewContent(createdAt) && (
          <span className="absolute right-0 top-0 rounded-bl rounded-tr bg-indigo-500 px-2 py-1 text-xs font-bold text-white">
            New
          </span>
        )
      )}

      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      {banner && (
        <img className="w-full max-h-[60vh] object-contain rounded-md" src={banner.url} alt={banner.alt} />
        // TODO: ^ should prob use nextjs Image, but causes problems when using external URLS
        // TODO: (fix) with non-landscape images, the corners wont be rounded
      )}
      <div className="flex flex-col flex-wrap gap-2 text-sm font-medium text-muted-foreground md:flex-row">
        <PostInfo post={post} />
      </div>
      <div className="relative mt-1 overflow-hidden">
        {truncateContent && (
          <div className="absolute bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-card opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-0" />
        )}
        <MarkDownView
          className={cn(
            "prose w-full max-w-none break-words dark:prose-invert",
            truncateContent && "line-clamp-7 sm:line-clamp-8"
          )}
          markdown={truncateContent ? content!.slice(0, 400) + "..." : content ?? ""}
        />
      </div>
    </Link>
  );
}

const InfoSpan = ({ Icon, text }: { Icon: LucideIcon; text: string }) => (
  <span className="flex items-center gap-1">
    <Icon size={18} />
    {text}
  </span>
);

const PostInfo = ({ post }: { post: Event | Post | PostWithAuthor }) => {
  const isEvent = "startDate" in post;
  return (
    <div className="flex flex-wrap gap-2 font-medium">
      <InfoSpan
        Icon={isEvent ? CalendarDays : User}
        text={
          isEvent
            ? formatDateRange(post.startDate, post.endDate)
            : "author" in post && post.author && post.author.name
              ? post.author.name
              : "CSS Team"
        }
      />
      <span className="hidden sm:block">•</span>
      {!isEvent && <span className="block sm:hidden">•</span>}
      <InfoSpan
        Icon={AlarmClock}
        text={
          isEvent
            ? getRelativeEventTime(post.startDate, post.endDate)
            : getRelativeTimeDiff(post.createdAt)
        }
      />
      {isEvent && post.location && (
        <>
          <span>•</span>
          <InfoSpan Icon={MapPin} text={post.location} />
        </>
      )}
    </div>
  );
};

export default PostCard;
