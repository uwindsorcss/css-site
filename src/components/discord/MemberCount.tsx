"use client";

import { animate, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";

function MemberCount({ memberCount }: { memberCount: number }) {
  const nodeRef = useRef() as React.MutableRefObject<HTMLSpanElement>;
  const inView = useInView(nodeRef, { once: true });
  useEffect(() => {
    const node = nodeRef.current;
    if (inView) {
      animate(0, memberCount, {
        duration: 2,
        onUpdate(value) {
          node.textContent = value.toFixed(0);
        },
      });
    }
  }, [inView, memberCount]);

  return (
    <span
      ref={nodeRef}
      className="font-black text-yellow-500 inline-block text-center"
      style={{
        minWidth: `${
          memberCount > 999 ? "6rem" : memberCount > 99 ? "4.5rem" : "3rem"
        }`,
      }}>
      {memberCount}
    </span>
  );
}

export default MemberCount;
