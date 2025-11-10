import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none resize-none",
        "bg-black/80 border-neutral-800 text-white placeholder:text-neutral-500",
        "focus-visible:border-[#00FFC2] focus-visible:ring-[#00FFC2]/20 focus-visible:ring-[3px]",
        "hover:border-neutral-700",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
