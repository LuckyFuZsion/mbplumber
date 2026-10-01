"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { CloseIcon, MenuIcon, PhoneIcon } from "./Icons";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MB Plumber logo" width={52} height={52} className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
          <span className="hidden leading-none sm:block">
            <span className="block text-lg font-black tracking-wide text-brand">MB PLUMBER</span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/60">Grantham</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                  active ? "bg-brand text-black" : "text-white/80 hover:text-brand"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href={SITE.phoneHref} className="btn btn-red !px-4 !py-2.5 text-sm sm:!px-5">
            <PhoneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{SITE.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
          <button
            type="button"
            className="rounded-full p-2.5 text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink px-4 pb-4 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-3.5 text-lg font-extrabold uppercase tracking-wider text-white hover:text-brand"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
