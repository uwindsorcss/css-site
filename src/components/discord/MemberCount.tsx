"use client";
import { animate, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MemberCountProps {
  count: number;
  ping?: boolean;
  text?: string;
  className?: string;
}

function MemberCount({ count = 0, ping = false, text, className }: MemberCountProps) {
  const nodeRef = useRef() as React.MutableRefObject<HTMLSpanElement>;
  const inView = useInView(nodeRef, { once: true });
  const pingColor = text === "Online" ? "bg-green-500" : "bg-gray-500";

  useEffect(() => {
    const node = nodeRef.current;
    if (inView) {
      animate(0, count, {
        duration: 2,
        onUpdate(value) {
          node.textContent = value.toFixed(0);
        },
      });
    }
  }, [inView, count]);

  return (
    <div className={cn("inline-flex items-center text-center gap-1", className)}>
      {ping && (
        <div className="relative inline-flex items-center h-2 w-2 mr-1">
          <span className={cn("w-2 h-2 rounded-full", pingColor)} />
          <span
            className={cn("absolute w-2 h-2 rounded-full animate-ping opacity-75", pingColor)}
          />
        </div>
      )}
      <span ref={nodeRef} style={{ width: nodeRef.current?.offsetWidth }}>
        {count}
      </span>
      {text}
    </div>
  );
}

export default MemberCount;
