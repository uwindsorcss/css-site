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
        text2 ? "flex-col flex-wrap md:flex-row" : ""
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

interface ImageProps {
  url: string;
  alt: string;
}

interface FeedViewProps {
  children: React.ReactNode;
  heading?: string;
  banner?: ImageProps;
  subheadings?: SubheadingProps[];
}

const FeedView = ({ children, heading, banner, subheadings }: FeedViewProps) => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-2">
      {(heading || (subheadings && subheadings.length > 0)) && (
        <div className="flex w-full flex-col gap-2">
          {heading && <h1 className="text-xl font-bold sm:text-2xl">{heading}</h1>}
          {banner && (
            <img className="w-full max-h-[60vh] object-contain rounded-md" src={banner.url} alt={banner.alt} />
            // TODO: ^ should prob use nextjs Image, but causes problems when using external URLS
            // TODO: (fix) with non-landscape images, the corners wont be rounded
          )}
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
