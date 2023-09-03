interface HeroProps {
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
}

function Hero({ children, heading, subheading }: HeroProps) {
  return (
    <section className="my-12">
      <div className="mx-auto flex flex-col items-center gap-16 py-8 px-4 max-w-7xl mb-20">
        <div className="max-w-xl text-center">
          {heading && (
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-5">
              {heading}
            </h2>
          )}
          {subheading && (
            <span className="text-md md:text-md lg:text-lg text-muted-foreground">
              {subheading}
            </span>
          )
          }
        </div>
        {children}
      </div>
    </section>
  );
}

export default Hero;
