import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, onCheckedChange, checked, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        className="peer opacity-0 absolute h-5 w-5"
        {...props}
      />
      <div
        className={cn(
          "h-5 w-5 rounded border border-primary flex items-center justify-center mr-2 transition-colors",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
          checked
            ? "bg-primary text-primary-foreground"
            : "bg-transparent",
          className
        )}
      >
        {checked && <CheckIcon className="h-3.5 w-3.5" />}
      </div>
    </div>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox }; 