import clsx from 'clsx';
import { FC, ReactNode, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    className?: string;
    children?: ReactNode;
    markdown: string;
    allowLinks?: boolean;
};

const MarkDownView: FC<Props> = memo(function MarkdownView({ className, markdown, allowLinks }) {
    return (
        <ReactMarkdown
            className={clsx(className, "prose dark:prose-invert max-w-none w-full break-words")}
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node, ...props }) => <p className="whitespace-pre-wrap" {...props} />,
                a: ({ node, ...props }) => {
                    if (allowLinks)
                        return <a {...props} />;
                    return <span className="underline font-medium" {...props} />;
                }
            }}
        >
            {markdown}
        </ReactMarkdown >
    );
});

export default MarkDownView;