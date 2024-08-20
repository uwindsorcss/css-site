"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedNumber({ value }: { value: number }) {
  if (value === undefined) {
    return <div></div>;
  }
  const nodeRef = useRef() as React.MutableRefObject<HTMLSpanElement>;
  const inView = useInView(nodeRef, { once: true });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 22 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (inView) spring.set(value);
  }, [spring, value, inView]);

  return (
    <motion.span
      ref={nodeRef}
      style={{
        display: "inline-block",
        minWidth: value.toString().length > 3 ? "4.2ch" : "3ch",
        textAlign: "right",
        marginRight: "2px",
      }}>
      {display}
    </motion.span>
  );
}

export default AnimatedNumber;
