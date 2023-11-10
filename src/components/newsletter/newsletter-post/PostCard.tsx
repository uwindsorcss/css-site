import { cn, getRelativeTimeDiff } from "@/lib/utils";
import Link from "next/link";
import MarkDownView from "@/components/views/MarkDownView";
import { AlarmClock, User } from "lucide-react";

interface PostProps {
  post: any;
  currentPage?: number;
  truncate?: boolean;
  animateOnHover?: boolean;
}

function PostCard({ post, currentPage, truncate, animateOnHover }: PostProps) {
  return (
    <Link
      key={post.id}
      href={`/newsletter/${post.id}${currentPage ? `?page=${currentPage}` : ""}`}
      className={cn(
        "flex flex-col gap-2 p-6 w-full bg-card text-card-foreground rounded-md duration-300 border border-border",
        animateOnHover
          ? "transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-lg"
          : "hover:bg-gray-200 dark:hover:bg-[#192236]"
      )}>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <div className="flex text-sm font-medium text-muted-foreground mb-2 gap-2 flex-wrap">
          <span className="flex items-center gap-1">
            <User size={18} />
            {post.author?.name ?? "CSS Team"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <AlarmClock size={18} />
            {getRelativeTimeDiff(post.createdAt)}
          </span>
        </div>
      </div>
      {truncate && post.content.length > 300 ? (
        <div className="relative overflow-hidden">
          <div className="absolute bottom-0 w-full h-[75%] bg-gradient-to-t from-card to-transparent z-10" />
          <MarkDownView
            className="prose dark:prose-invert max-w-none w-full break-words"
            markdown={post.content.slice(0, 300) + "..."}
          />
        </div>
      ) : (
        <MarkDownView
          className="prose dark:prose-invert max-w-none w-full break-words"
          markdown={post.content}
        />
      )}
    </Link>
  );
}

export default PostCard;
