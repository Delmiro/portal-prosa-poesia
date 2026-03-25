import Image from "next/image";
import { cn } from "@/lib/utils";

type AuthorAvatarProps = {
  src: string;
  alt: string;
  size?: "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
};

const sizeClass = {
  md: "size-16",
  lg: "size-20 sm:size-24",
  xl: "size-28 sm:size-32",
} as const;

const pixel = {
  md: 128,
  lg: 192,
  xl: 256,
} as const;

export function AuthorAvatar({
  src,
  alt,
  size = "lg",
  className,
  priority = false,
}: AuthorAvatarProps) {
  const px = pixel[size];
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border/60",
        sizeClass[size],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className="h-full w-full object-cover"
        sizes={
          size === "md"
            ? "64px"
            : size === "xl"
              ? "(max-width: 640px) 112px, 128px"
              : "(max-width: 640px) 80px, 96px"
        }
        priority={priority}
      />
    </div>
  );
}
