"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HTMLFlipBookRaw = dynamic(() => import("react-pageflip"), { ssr: false });

type PageFlipApi = {
  flipNext: () => void;
  flipPrev: () => void;
};

type PageFlipHandle = { pageFlip: () => PageFlipApi };

/** Tipos npm `react-pageflip` exigem dezenas de props; o runtime aceita o subconjunto usado. */
const HTMLFlipBook = HTMLFlipBookRaw as unknown as ComponentType<{
  ref?: Ref<PageFlipHandle | null>;
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  size: "fixed" | string;
  mobileScrollSupport?: boolean;
  showCover?: boolean;
  flippingTime?: number;
  usePortrait?: boolean;
  onFlip?: (e: { data: number }) => void;
  children?: ReactNode;
}>;

type Props = {
  pages: Array<{ pdfUrl: string; label?: string | null }>;
};

export function MagazinePdfFlipbook({ pages }: Props) {
  const bookRef = useRef<PageFlipHandle | null>(null);
  const [page, setPage] = useState(0);

  const width = 720;
  const height = 980;

  return (
    <div className="w-full min-w-0">
      <div className="overflow-hidden rounded-t-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-lg">
        <div className="flex items-center justify-center gap-3 px-3 py-3 sm:gap-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-10 shrink-0 border-0 bg-primary px-3 text-white shadow-sm hover:bg-[var(--primary-strong)] sm:h-9"
            onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4 shrink-0" />
            <span className="ml-1 text-sm font-medium">Anterior</span>
          </Button>
          <span className="min-w-[5rem] shrink-0 px-1 text-center text-sm tabular-nums text-zinc-200 sm:min-w-[7rem]">
            {page + 1} / {pages.length}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-10 shrink-0 border-0 bg-primary px-3 text-white shadow-sm hover:bg-[var(--primary-strong)] sm:h-9"
            onClick={() => bookRef.current?.pageFlip()?.flipNext()}
            aria-label="Próxima página"
          >
            <span className="mr-1 text-sm font-medium">Próxima</span>
            <ChevronRight className="size-4 shrink-0" />
          </Button>
        </div>
      </div>

      <div className="rounded-b-xl border border-t-0 border-zinc-300 bg-[#d9d9d9] px-2 pb-6 pt-4 shadow-inner dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="flex justify-center overflow-visible pb-2 [overflow-anchor:none]">
          <div className="rounded-md bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <HTMLFlipBook
              ref={bookRef}
              width={width}
              height={height}
              minWidth={width}
              maxWidth={width}
              minHeight={height}
              maxHeight={height}
              size="fixed"
              mobileScrollSupport
              showCover={false}
              flippingTime={900}
              usePortrait
              onFlip={(e: { data: number }) => setPage(e.data)}
            >
              {pages.map((p, index) => (
                <div key={`${p.pdfUrl}-${index}`} className="h-full w-full bg-white">
                  <iframe
                    src={`${p.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title={p.label || `Página ${index + 1}`}
                    className="h-full w-full border-0"
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>
    </div>
  );
}
