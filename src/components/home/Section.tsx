interface HeroProps {
  children: React.ReactNode;
}

function Hero({ children }: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-4">
      {children}
    </section>
  );
}

export default Hero;
