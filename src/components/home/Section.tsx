import clsx from "clsx";

interface HeroProps {
  className?: string;
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
}

function Hero({ className, children, heading, subheading }: HeroProps) {
  return (
    <section className={clsx("min-h-[50vh] my-12", className)}>
      <div className="mx-auto flex flex-col items-center gap-8 py-8 px-4 max-w-7xl mb-20 w-full">
        <div className="max-w-xl text-center">
          {heading && (
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-5">{heading}</h2>
          )}
          {subheading && (
            <span className="text-md md:text-md lg:text-lg text-muted-foreground">
              {subheading}
            </span>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

export default Hero;
