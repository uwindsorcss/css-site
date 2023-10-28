import clsx from "clsx";
import styles from "./Hero.module.css";
import HeroCircuitAnimation from "./HeroCircuitAnimation";

interface HeroProps {
  children: React.ReactNode;
}

function Hero({ children }: HeroProps) {
  return (
    <div className={clsx(styles.hero, "relative bg-background")}>
      <HeroCircuitAnimation />
      <section className="flex flex-col items-center justify-center min-h-screen gap-3 sm:gap-8 relative z-10 p-5 text-center">
        {children}
      </section>
    </div>
  );
}

export default Hero;
