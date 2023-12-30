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
    : `/newsletter/${post.id}${currentPage ? `?page=${currentPage}` : ""}`;
  const content = isEvent ? post.description : post.content;
  const numOfLines: number = markdownToTextWithNewLines(content!).split("\n").length;
  const truncateContent = truncate && (content!.length > 400 || numOfLines > 5);

  return (
    <Link
      key={id}
      href={linkUrl}
      className="group relative flex flex-col gap-2 p-6 w-full bg-card text-card-foreground rounded-md border border-border transition-border duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-[#192236] hover:border-gray-600">
      {/* Visibility and New Indicators */}
      {"visible" in post && !post.visible ? (
        <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-bl rounded-tr w-11 flex items-center justify-center">
          <EyeOff size={16} />
        </span>
      ) : (
        isNewContent(createdAt) && (
          <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl rounded-tr">
            New
          </span>
        )
      )}

      <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
      <div className="flex font-medium gap-2 flex-col md:flex-row flex-wrap text-sm text-muted-foreground">
        <PostInfo post={post} />
      </div>
      <div className="relative overflow-hidden mt-1">
        {truncateContent && (
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-card opacity-100 group-hover:opacity-0 duration-300 ease-in-out transition-all" />
        )}
        <MarkDownView
          className={cn(
            "prose dark:prose-invert max-w-none w-full break-words",
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
    <div className="flex font-medium gap-2 flex-wrap">
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
