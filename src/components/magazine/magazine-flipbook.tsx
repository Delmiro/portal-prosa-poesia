"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  List,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { FLIPBOOK_PAGE_COUNT, sumarioEdicao20 } from "@/content/sumario-edicao-20";
import { edicao20PrintPages } from "@/content/edicao-20-prints";
import { Button } from "@/components/ui/button";
import { MagazinePage } from "@/components/magazine/magazine-page";
import { cn } from "@/lib/utils";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const ZOOM_STEPS = [0.82, 0.92, 1, 1.1, 1.22] as const;

type PageFlipApi = {
  flipNext: () => void;
  flipPrev: () => void;
  flip: (pageNum: number, corner: "top" | "bottom") => void;
  getCurrentPageIndex: () => number;
  getPageCount: () => number;
};

/** Proporção aproximada A4 em pé (altura / largura). */
const PAGE_ASPECT = 1.4;

function useFlipbookBaseSize() {
  const [base, setBase] = useState({ w: 360, h: 504 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const padX = vw < 640 ? 12 : vw < 1024 ? 20 : 32;
      const maxW = Math.min(vw - padX, vw < 640 ? 560 : vw < 1024 ? 820 : 1040);
      const maxH = Math.max(320, Math.floor(vh * 0.9));
      let h = maxH;
      let w = Math.round(h / PAGE_ASPECT);
      if (w > maxW) {
        w = maxW;
        h = Math.round(w * PAGE_ASPECT);
      }
      setBase({ w: Math.max(280, w), h: Math.min(h, maxH) });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return base;
}

export function MagazineFlipbook() {
  const bookRef = useRef<{ pageFlip: () => PageFlipApi } | null>(null);
  const [page, setPage] = useState(0);
  const [zoomStepIdx, setZoomStepIdx] = useState(2);
  const [tocOpen, setTocOpen] = useState(false);
  const baseSize = useFlipbookBaseSize();
  const zoom = ZOOM_STEPS[zoomStepIdx];
  const w = Math.round(baseSize.w * zoom);
  const h = Math.round(baseSize.h * zoom);

  const onFlip = useCallback((e: { data: number }) => {
    setPage(e.data);
  }, []);

  const api = () => bookRef.current?.pageFlip();

  const flipNext = () => api()?.flipNext();
  const flipPrev = () => api()?.flipPrev();

  const goToPage = (pageIndex: number) => {
    api()?.flip(pageIndex, "top");
    setTocOpen(false);
  };

  const zoomIn = () => setZoomStepIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
  const zoomOut = () => setZoomStepIdx((i) => Math.max(i - 1, 0));

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-t-xl border border-zinc-700/80 bg-zinc-900 text-zinc-100 shadow-lg">
        <div className="flex flex-wrap items-center justify-center gap-1.5 px-2 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            onClick={() => setTocOpen(true)}
          >
            <List className="size-4 sm:mr-1" />
            <span className="hidden sm:inline">Sumário</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            onClick={flipPrev}
          >
            <ChevronLeft className="size-4 sm:mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          <span className="min-w-[7.5rem] px-1 text-center text-xs tabular-nums text-zinc-300 sm:text-sm">
            {page + 1} / {FLIPBOOK_PAGE_COUNT}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            onClick={flipNext}
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="size-4 sm:ml-1" />
          </Button>
          <span className="mx-1 hidden h-5 w-px bg-zinc-600 sm:inline" aria-hidden />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            onClick={zoomOut}
            disabled={zoomStepIdx <= 0}
            aria-label="Reduzir zoom"
          >
            <ZoomOut className="size-4" />
          </Button>
          <span className="min-w-[2.75rem] text-center text-xs tabular-nums text-zinc-400">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="border-0 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            onClick={zoomIn}
            disabled={zoomStepIdx >= ZOOM_STEPS.length - 1}
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "rounded-b-xl border border-t-0 border-zinc-300 bg-[#d9d9d9] px-2 pb-6 pt-4 shadow-inner",
          "dark:border-zinc-700 dark:bg-zinc-900/80"
        )}
      >
        <div className="flex justify-center overflow-x-auto overflow-hidden pb-2 [overflow-anchor:none]">
          <div
            className="rounded-md bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            style={{
              touchAction: "manipulation",
              width: "min(100%, 100vw - 16px)",
              maxWidth: w,
            }}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={w}
              height={h}
              minWidth={w}
              maxWidth={w}
              minHeight={h}
              maxHeight={h}
              size="fixed"
              maxShadowOpacity={0.45}
              showCover={false}
              mobileScrollSupport
              className="flipbook-root mx-auto block"
              style={{ width: w, maxWidth: "100%" }}
              startPage={0}
              drawShadow
              flippingTime={1500}
              usePortrait
              startZIndex={0}
              autoSize={false}
              clickEventForward
              useMouseEvents
              swipeDistance={28}
              showPageCorners
              disableFlipByClick={false}
              onFlip={onFlip}
            >
              {edicao20PrintPages.map((src, index) => (
                <MagazinePage
                  key={src}
                  className="border-0 bg-zinc-800/95 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="relative min-h-0 flex-1 bg-zinc-900">
                      <img
                        src={src}
                        alt={`Edição 20 — página ${index + 1}`}
                        className="block h-full w-full object-contain object-center"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                  </div>
                </MagazinePage>
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      </div>

      {tocOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Sumário da revista"
          onClick={() => setTocOpen(false)}
        >
          <aside
            className="h-full w-full max-w-sm overflow-y-auto border-l border-zinc-200 bg-background p-4 shadow-xl dark:border-zinc-800 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-serif text-lg font-semibold">Sumário</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setTocOpen(false)}>
                Fechar
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Toque para ir à página.</p>
            <ol className="mt-4 space-y-1">
              {sumarioEdicao20.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goToPage(item.pageIndex)}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm transition active:bg-muted",
                      page === item.pageIndex && "bg-muted font-medium"
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="shrink-0 text-right text-xs text-muted-foreground">
                      <span className="tabular-nums">{item.pageIndex + 1}</span>
                      {" · "}
                      <span className="tabular-nums">PDF {item.pdfPage}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      ) : null}

    </div>
  );
}
