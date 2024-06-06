"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

interface WordObject {
  id: number;
  word: string;
  special?: boolean;
}

function ChipTyping() {
  const coolDown = 200;
  const [words, setWords] = useState<WordObject[]>([]);
  const [lastClicked, setLastClicked] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const handleAnimationComplete = (completedSpawn: number) => {
    setWords((prevSpawns) => prevSpawns.filter((spawn) => spawn.id !== completedSpawn));
  };

  const countToWordMap: Record<number, string> = {
    0: "Hello!",
    5: "I'm Chip!",
    10: "I'm CSS's mascot!",
    15: "I love typing!",
    30: "Look at me go!",
    60: "Have you ever seen a cat type?",
    80: "I love Computers!",
    110: "I'm a quick typer!",
    160: "Actually, a typing master!",
    210: "Typing is my passion!",
    260: "I'm getting a bit tired...",
    310: "I'm going to take a break...",
    320: "Just kidding!",
    360: "Did you finish your assignment?",
    410: "I think you should get back to work!",
    460: "How about you check out our events?",
    470: "Or maybe the newsletters?",
    510: "Enjoy the rest of your day!",
  };

  const handleClick = () => {
    const now = Date.now();

    if (now - lastClicked > coolDown) {
      setCount(count + 1);
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

      if (!isTyping) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, coolDown);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="absolute right-[50%] top-[53px] h-[105px] w-[90px] translate-x-[50%] cursor-pointer select-none sm:right-[5%] sm:top-[44px] sm:h-[150px] sm:w-[125px]"
      draggable={false}>
      {count === 0 && (
        <div className="absolute right-[20%] top-[-20px] rotate-[10deg] transform text-center text-xs opacity-50 sm:text-sm">
          <span className="text-xs sm:text-sm">Click me!</span>
        </div>
      )}
      <Image
        src={`/images/chip-2.png`}
        alt="Chip Waving"
        fill
        draggable={false}
        className={clsx({ hidden: isTyping })}
        priority
      />
      <Image
        src={`/images/chip-3.png`}
        alt="Chip Typing"
        fill
        draggable={false}
        className={clsx({ hidden: !isTyping })}
        priority
      />
      <AnimatePresence>
        {words.map((spawn) => (
          <motion.div
            key={spawn.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: spawn.special ? -150 : -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: spawn.special ? 5 : 3 }}
            style={{
              position: "absolute",
              left: `${spawn.id % 100}px`,
              rotate: `${spawn.id % 2 === 1 ? "-" : ""}${spawn.id % 25}deg`,
            }}
            onAnimationComplete={() => handleAnimationComplete(spawn.id)}>
            <span className={`${spawn.special ? "font-bold text-amber-400" : ""}`}>
              {spawn.word}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ChipTyping;
