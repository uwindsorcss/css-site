import clsx from "clsx";

interface HeroProps {
  className?: string;
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
}

function Section({ className, children, heading, subheading }: HeroProps) {
  return (
    <section className={clsx("min-h-[50vh] py-12", className)}>
      <div className="mx-auto mb-20 flex w-full max-w-7xl flex-col items-center gap-8 px-4 py-8">
        <div className="text-center">
          {heading && (
            <h2 className="mb-5 text-3xl font-bold md:text-3xl lg:text-4xl">{heading}</h2>
          )}
          {subheading && (
            <span className="text-md md:text-md text-muted-foreground lg:text-lg">
              {subheading}
            </span>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

export default Section;
