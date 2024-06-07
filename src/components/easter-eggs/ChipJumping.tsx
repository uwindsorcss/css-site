"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function ChipJumping() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  return (
    <motion.div
      className="absolute right-[-15px] top-[-105px] h-[115px] w-[100px] sm:right-[-40px] sm:top-[-140px] sm:h-[150px] sm:w-[125px]"
      animate={isAnimating ? { y: [0, -30, 0] } : {}}
      transition={{ stiffness: 1, duration: 0.4 }}
      onAnimationComplete={() => setIsAnimating(false)}
      onClick={handleClick}>
      <Image
        src="/images/chip.png"
        alt="Chip"
        fill
        className="cursor-pointer select-none"
        draggable={false}
      />
    </motion.div>
  );
}

export default ChipJumping;
