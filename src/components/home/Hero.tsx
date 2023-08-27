import styles from "./Hero.module.css";
import HeroCircuitAnimation from "./HeroCircuitAnimation";

interface HeroProps {
  children: React.ReactNode;
}

function Hero({ children }: HeroProps) {
  return (
    <div className={styles.hero}>
      <HeroCircuitAnimation />
      <section className="flex flex-col items-center justify-center min-h-screen gap-8 text-white relative z-10">
        {children}
      </section>
    </div>
  );
}

export default Hero;
