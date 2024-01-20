"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WordObject {
  id: number;
  word: string;
  special?: boolean;
}

function ChipTyping() {
  const coolDown = 200;
  const [words, setWords] = useState<WordObject[]>([]);
  const [lastClicked, setLastClicked] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<number>(2);
  const [count, setCount] = useState<number>(0);

  const fadeAndFloatAnimation = {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: -50 },
    exit: { opacity: 0 },
  };

  const handleAnimationComplete = (completedSpawn: number) => {
    setWords((prevSpawns) => prevSpawns.filter((spawn) => spawn.id !== completedSpawn));
  };

  const countToWordMap: Record<number, string> = {
    0: "Hello!",
    5: "I'm Chip!",
    10: "I'm CSS's mascot!",
    15: "I love typing!",
    30: "Oh wow, you're still going?",
    60: "You're really dedicated!",
    80: "I'm impressed!",
  };

  const handleClick = () => {
    const now = Date.now();
    setCount(count + 1);

    if (now - lastClicked > coolDown) {
      let word = "";
      let special = false;

      if (count in countToWordMap) {
        word = countToWordMap[count];
        special = true;
      } else if (count >= 100 && count % 50 === 0) {
        word = `${count} clicks!`;
        special = true;
      } else word = count % 2 === 0 ? "*Click*" : "*Clack*";

      setWords((prevSpawns) => [...prevSpawns, { id: now, word, special }]);
      setLastClicked(now);

      if (currentImage === 2) {
        setCurrentImage(3);
        setTimeout(() => {
          setCurrentImage(2);
        }, coolDown);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="absolute w-[90px] h-[105px] sm:w-[125px] sm:h-[150px] top-[53px] right-[50%] sm:top-[44px] sm:right-[5%] select-none translate-x-[50%]"
      draggable={false}>
      <Image src={`/images/chip-${currentImage}.png`} alt="Chip" fill draggable={false} />
      <AnimatePresence>
        {words.map((spawn) => (
          <motion.div
            key={spawn.id}
            initial={fadeAndFloatAnimation.initial}
            animate={fadeAndFloatAnimation.animate}
            exit={fadeAndFloatAnimation.exit}
            transition={{ duration: 3 }}
            style={{
              position: "absolute",
              left: `${spawn.id % 100}px`,
              rotate: `
                                ${spawn.id % 2 === 1 ? "-" : ""}${spawn.id % 25}deg`,
            }}
            onAnimationComplete={() => handleAnimationComplete(spawn.id)}>
            <span className={`${spawn.special ? "font-bold text-amber-500" : ""}`}>
              {spawn.word}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ChipTyping;
