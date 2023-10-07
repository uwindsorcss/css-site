interface FeedViewProps {
  children: React.ReactNode;
  heading?: string;
  subheading?: string | null;
  subheadingIcon?: React.ReactNode;
  subheading2?: string | null;
  subheading2Icon?: React.ReactNode;
}

function FeedView({
  children,
  heading,
  subheading,
  subheadingIcon,
  subheading2,
  subheading2Icon,
}: FeedViewProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 max-w-2xl mx-auto">
      {(heading || subheading) && (
        <div className="w-full">
          {heading && <h1 className="text-2xl md:text-3xl font-bold mb-2">{heading}</h1>}
          {subheading && subheading !== null && (
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-1">
              {subheadingIcon && subheadingIcon !== null && <>{subheadingIcon}</>}
              {subheading}
            </div>
          )}
          {subheading2 && subheading2 !== null && (
            <>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                {subheading2Icon && subheading2Icon !== null && <>{subheading2Icon}</>}
                {subheading2}
              </div>
            </>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default FeedView;
