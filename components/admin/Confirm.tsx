"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type ConfirmOptions = {
  /** Question shown as the heading, e.g. "Delete this project?" */
  title: string;
  /** Exactly what is affected, shown in bold, e.g. the project's name. */
  name?: string;
  /** Extra line under the name, e.g. "4 photos". */
  detail?: string;
  /** Optional thumbnail of the thing being removed. */
  image?: string;
  /** What happens, in plain words. */
  message?: string;
  confirmLabel?: string;
  /** Red button for destructive actions (default true). */
  danger?: boolean;
};

type Ask = (opts: ConfirmOptions) => Promise<boolean>;
const Ctx = createContext<Ask | null>(null);

export function useConfirm(): Ask {
  const ask = useContext(Ctx);
  if (!ask) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ask;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ opts: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const ask = useCallback<Ask>((opts) => new Promise<boolean>((resolve) => setState({ opts, resolve })), []);

  const close = useCallback(
    (answer: boolean) => {
      state?.resolve(answer);
      setState(null);
    },
    [state],
  );

  useEffect(() => {
    if (!state) return;
    cancelRef.current?.focus(); // Cancel is focused first, so Enter never deletes by accident
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  const o = state?.opts;
  const danger = o?.danger !== false;

  return (
    <Ctx.Provider value={ask}>
      {children}
      {o && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4" onClick={() => close(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl border border-white/15 bg-ink-soft p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-title" className="text-xl font-extrabold">
              {o.title}
            </h2>

            {(o.name || o.image) && (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/10 bg-black/50 p-3">
                {o.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0">
                  {o.name && <p className="break-words font-extrabold">&ldquo;{o.name}&rdquo;</p>}
                  {o.detail && <p className="text-sm text-white/55">{o.detail}</p>}
                </div>
              </div>
            )}

            {o.message && <p className="mt-4 text-sm leading-relaxed text-white/70">{o.message}</p>}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button ref={cancelRef} type="button" className="btn btn-ghost !px-5 !py-2.5 text-sm" onClick={() => close(false)}>
                Cancel
              </button>
              <button type="button" className={`btn ${danger ? "btn-red" : "btn-yellow"} !px-5 !py-2.5 text-sm`} onClick={() => close(true)}>
                {o.confirmLabel ?? "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
