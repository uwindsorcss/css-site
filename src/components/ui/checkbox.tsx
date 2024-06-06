"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  size?: "small" | "medium" | "large";
};

const sizeMapping = {
  small: "h-4 w-4",
  medium: "h-5 w-5",
  large: "h-6 w-6",
};

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, size = "small", ...props }, ref) => {
    const baseSize = sizeMapping[size] || sizeMapping.small;

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          baseSize,
          `peer shrink-0 rounded-sm border border-gray-600 bg-muted ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        {...props}>
        <CheckboxPrimitive.Indicator className={cn("text-bg flex items-center justify-center")}>
          <Check className={baseSize} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
