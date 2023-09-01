interface HeroProps {
  title?: string;
  children?: React.ReactNode;
}

function Hero({ children, title }: HeroProps) {
  return (
    <section className="min-h-screen">
      <div className="mx-auto flex flex-col items-center min-h-screen gap-20 py-8 px-4 max-w-7xl mb-20">
        {title && (
          <h2 className="text-3xl md:text-3xl lg:text-4xl text-center font-bold mb-5">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

export default Hero;
