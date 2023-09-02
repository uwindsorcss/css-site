import { FC, ReactNode, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    className?: string;
    children?: ReactNode;
    markdown: string;
};

const MarkDownView: FC<Props> = memo(function MarkdownView({ className, markdown }) {
    return (
        <ReactMarkdown
            className={className}
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node, ...props }) => <p className="whitespace-pre-wrap" {...props} />,
                a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
            }}
        >
            {markdown}
        </ReactMarkdown >
    );
});

export default MarkDownView;