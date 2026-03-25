import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type MagazinePageProps = {
  children: React.ReactNode;
  className?: string;
};

export const MagazinePage = forwardRef<HTMLDivElement, MagazinePageProps>(
  function MagazinePage({ children, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full flex-col overflow-hidden border border-stone-200/90 bg-[#faf6ef] text-stone-900 shadow-[inset_0_0_40px_rgba(0,0,0,0.04)]",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
