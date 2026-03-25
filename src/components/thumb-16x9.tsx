import Image from "next/image";
import { cn } from "@/lib/utils";

type Thumb16x9Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function Thumb16x9({ src, alt, priority, className }: Thumb16x9Props) {
  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
        priority={priority}
      />
    </div>
  );
}
