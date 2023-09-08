interface FeedViewProps {
  children: React.ReactNode;
  heading?: string;
  subheading?: string | null;
  subheading2?: string | null;
}

function FeedView({ children, heading, subheading, subheading2 }: FeedViewProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 max-w-2xl mx-auto">
      {(heading || subheading) && (
        <div className="w-full mb-2">
          {heading && <h1 className="text-2xl md:text-3xl font-bold">{heading}</h1>}
          {subheading && subheading !== null && (
            <span className="text-sm font-medium text-muted-foreground">{subheading}</span>
          )}
          {subheading2 && subheading2 !== null && (
            <>
              <br />
              <span className="text-sm font-medium text-muted-foreground">{subheading2}</span>
            </>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default FeedView;
