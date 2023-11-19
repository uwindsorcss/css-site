import { LucideIcon } from "lucide-react";

interface SubheadingProps {
  text: string | null;
  Icon?: LucideIcon;
  text2?: string | null;
  Icon2?: LucideIcon;
}

const Subheading = ({ text, Icon, text2, Icon2 }: SubheadingProps) => {
  if (!text) return null;

  const renderIcon = (Icon: LucideIcon | undefined) =>
    Icon ? <Icon size={18} className="mr-1" /> : null;

  return (
    <div
      className={`flex gap-2 text-sm font-medium text-muted-foreground ${
        text2 ? "md:flex-row flex-col flex-wrap" : ""
      }`}>
      <span className="flex items-center gap-1">
        {renderIcon(Icon)}
        {text}
      </span>
      {text2 && (
        <>
          <span className="hidden md:block">•</span>
          <span className="flex items-center gap-1">
            {renderIcon(Icon2)}
            {text2}
          </span>
        </>
      )}
    </div>
  );
};

interface FeedViewProps {
  children: React.ReactNode;
  heading?: string;
  subheadings?: SubheadingProps[];
}

const FeedView = ({ children, heading, subheadings }: FeedViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 max-w-2xl mx-auto">
      {(heading || (subheadings && subheadings.length > 0)) && (
        <div className="w-full flex flex-col gap-2">
          {heading && <h1 className="text-xl sm:text-2xl font-bold">{heading}</h1>}
          {subheadings?.map(({ text, Icon, text2, Icon2 }, index) => (
            <Subheading key={index} text={text} Icon={Icon} text2={text2} Icon2={Icon2} />
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

export default FeedView;
