import { FC, ReactNode } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import BoardMembers from "../about/BoardMembers";
import ImageWithModal from "@/components/modals/ImageModal";

type Props = {
  className?: string;
  children?: ReactNode;
  markdown: string;
  allowLinks?: boolean;
};

// memo removed to prevent hydration mismatch
const MarkDownView: FC<Props> = function MarkdownView({ className, markdown, allowLinks }) {
  return (
    <ReactMarkdown
      className={clsx(className, "prose w-full max-w-none break-words dark:prose-invert")}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ node, ...props }) => <p className="whitespace-pre-wrap" {...props} />,
        a: ({ node, ...props }) => {
          if (allowLinks) return <a {...props} />;
          return <span className="font-medium underline" {...props} />;
        },
        img: ({ node, ...props }) => <ImageWithModal src={props.src || ''} alt={props.alt ?? ''} {...props} />,
        // @ts-ignore
        members: BoardMembers,
      }}>
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkDownView;