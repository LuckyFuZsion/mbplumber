"use client";

import { useCallback, useEffect, useState } from "react";
import { cldUrl } from "@/lib/img";
import { CloseIcon } from "./Icons";

export type GridItem = { id: string; url: string; width: number; height: number; caption: string; category: string };

export function GalleryGrid({ items }: { items: GridItem[] }) {
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const [filter, setFilter] = useState("All");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);
  const active = openIdx !== null ? shown[openIdx] : null;

  const step = useCallback(
    (d: number) => setOpenIdx((i) => (i === null ? i : (i + d + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, step]);

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                filter === c ? "bg-brand text-black" : "border border-white/20 text-white/80 hover:border-brand hover:text-brand"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {shown.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setOpenIdx(i)}
            className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-soft text-left [break-inside:avoid]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldUrl(item.url, 900)}
              alt={item.caption || `${item.category} by MB Plumber`}
              width={item.width}
              height={item.height}
              loading="lazy"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12">
              <span className="mb-1 inline-block rounded-full bg-brand px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-black">
                {item.category}
              </span>
              {item.caption && <p className="text-sm font-semibold leading-snug text-white">{item.caption}</p>}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Photo"}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 p-4"
          onClick={() => setOpenIdx(null)}
        >
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-3 hover:bg-white/20" aria-label="Close" onClick={() => setOpenIdx(null)}>
            <CloseIcon className="h-6 w-6" />
          </button>
          {shown.length > 1 && (
            <>
              <button
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl font-black hover:bg-brand hover:text-black"
                onClick={(e) => (e.stopPropagation(), step(-1))}
              >
                ‹
              </button>
              <button
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl font-black hover:bg-brand hover:text-black"
                onClick={(e) => (e.stopPropagation(), step(1))}
              >
                ›
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cldUrl(active.url, 1800)}
            alt={active.caption || active.category}
            className="max-h-[78vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="mt-4 max-w-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <span className="eyebrow">{active.category}</span>
            {active.caption && <p className="mt-1 text-lg font-semibold">{active.caption}</p>}
          </div>
        </div>
      )}
    </>
  );
}
