import styles from "./Hero.module.css";

interface HeroProps {
  children: React.ReactNode;
}

function Hero({ children }: HeroProps) {
  return (
    <div className={styles.hero}>
      <section className="flex flex-col items-center justify-center min-h-screen gap-5 text-white relative z-1">
        {children}
      </section>
    </div>
  );
}

export default Hero;
