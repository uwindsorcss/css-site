import clsx from "clsx";
import { FC, ReactNode, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Anika from "../easter-eggs/Anika";
import BoardMembers from "../about/BoardMembers";

type Props = {
  className?: string;
  children?: ReactNode;
  markdown: string;
  allowLinks?: boolean;
};

const MarkDownView: FC<Props> = memo(function MarkdownView({ className, markdown, allowLinks }) {
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
        // @ts-ignore
        anika: Anika,
        // @ts-ignore
        members: BoardMembers,
      }}>
      {markdown}
    </ReactMarkdown>
  );
});

export default MarkDownView;
