interface FeedViewProps {
  children: React.ReactNode;
  heading?: string;
  subheading?: string;
}

function FeedView({ children, heading, subheading }: FeedViewProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 max-w-2xl mx-auto">
      {(heading || subheading) && (
        <div className="w-full mb-2">
          {heading && <h1 className="text-2xl md:text-3xl font-bold">{heading}</h1>}
          {subheading && (
            <span className="text-sm font-medium text-muted-foreground">{subheading}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default FeedView;
