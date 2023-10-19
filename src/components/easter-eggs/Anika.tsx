"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function Anika() {
    const [imageSpawns, setImageSpawns] = useState<number[]>([]);
    const [lastClicked, setLastClicked] = useState<number>(0);

    const fadeAndFloatAnimation = {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 0, y: -50 },
        exit: { opacity: 0 }
    };

    const handleAnimationComplete = (completedSpawn: number) => {
        setImageSpawns(prevSpawns => prevSpawns.filter(spawn => spawn !== completedSpawn));
    };

    const handleClick = () => {
        const now = Date.now();

        if (now - lastClicked > 500) {
            setImageSpawns(prevSpawns => [...prevSpawns, now]);
            setLastClicked(now);
        }
    };

    return (
        <span
            onClick={handleClick}
            style={{ position: 'relative', display: 'inline-block' }}>
            Anika Khan
            <AnimatePresence>
                {imageSpawns.map(spawn => (
                    <motion.div
                        key={spawn}
                        initial={fadeAndFloatAnimation.initial}
                        animate={fadeAndFloatAnimation.animate}
                        exit={fadeAndFloatAnimation.exit}
                        transition={{ duration: 3 }}
                        style={{ position: 'absolute', top: '-50px', left: '30px' }}
                        onAnimationComplete={() => handleAnimationComplete(spawn)}
                    >
                        <Image src="/images/dancing-duck.gif" alt="Dancing Duck" width={40} height={40} style={{ userSelect: 'none' }} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </span>
    );
}

export default Anika;
