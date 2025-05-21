"use client";

interface AvatarProps {
  src?: string | null;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, initials, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  const classes = `rounded-full overflow-hidden flex items-center justify-center font-medium bg-primary/10 text-primary ${sizeClasses[size]}`;

  if (src) {
    return (
      <div className={classes}>
        <img src={src} alt={initials || "Avatar"} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={classes}>
      {initials || "?"}
    </div>
  );
} 