import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../lib/utils.js";

const Button = React.forwardRef(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-8 py-3 bg-primary",
          variant === "primary" &&
          "bg-primary text-neutral shadow-[4px_4px_0px_#1A1A1A] hover:shadow-none transform hover:translate-x-1 hover:translate-y-1",
          variant === "secondary" &&
          "bg-neutral text-white border-2 border-primary hover:bg-primary hover:text-neutral",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
