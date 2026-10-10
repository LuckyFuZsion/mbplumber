"use client";

import { useState } from "react";
import { SECTION_LABELS, type SectionKey } from "@/lib/content";
import { useConfirm } from "./Confirm";

export const fieldClass =
  "w-full rounded-lg border border-white/20 bg-black px-3 py-2.5 text-sm font-medium text-white placeholder:text-white/40 focus:border-brand focus:outline-none";

export function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  hint,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-white/60">{label}</span>
      {textarea ? (
        <textarea className={fieldClass} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={fieldClass} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-1 block text-xs text-white/45">{hint}</span>}
    </label>
  );
}

export const move = <T,>(arr: T[], i: number, d: number): T[] => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
export const setAt = <T,>(arr: T[], i: number, patch: Partial<T>): T[] => arr.map((x, j) => (j === i ? { ...x, ...patch } : x));
export const removeAt = <T,>(arr: T[], i: number): T[] => arr.filter((_, j) => j !== i);

export function MiniButton({ children, onClick, danger, disabled }: { children: React.ReactNode; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border px-2.5 py-1 text-xs font-bold disabled:opacity-30 ${
        danger ? "border-brand-red/50 text-brand-red hover:bg-brand-red/10" : "border-white/20 text-white/75 hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

/** Save / revert logic shared by every section editor. */
export function useSectionEditor<T>(section: SectionKey, initial: T, customised: boolean) {
  const [draft, setDraft] = useState<T>(initial);
  const [saved, setSaved] = useState<T>(initial);
  const [isCustom, setIsCustom] = useState(customised);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const ask = useConfirm();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, value: draft }),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(draft);
      setIsCustom(true);
      setMsg({ ok: true, text: "Saved. The live site is updated." });
    } else {
      setMsg({ ok: false, text: (await res.json().catch(() => ({}))).error ?? "Couldn't save." });
    }
  }

  async function revert() {
    const yes = await ask({
      title: "Revert to the original?",
      name: SECTION_LABELS[section],
      message: "Everything you have changed in this section will be replaced with the original wording and photos. You can undo this from the History tab.",
      confirmLabel: "Yes, revert",
    });
    if (!yes) return;
    setBusy(true);
    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section }),
    });
    if (res.ok) window.location.reload();
    else {
      setBusy(false);
      setMsg({ ok: false, text: "Couldn't revert." });
    }
  }

  return { draft, setDraft, dirty, isCustom, busy, msg, save, revert };
}

export function SectionShell({
  title,
  help,
  editor,
  children,
}: {
  title: string;
  help?: string;
  editor: { dirty: boolean; isCustom: boolean; busy: boolean; msg: { ok: boolean; text: string } | null; save: () => void; revert: () => void };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">{title}</h2>
          {help && <p className="mt-1 max-w-2xl text-sm text-white/55">{help}</p>}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
            editor.isCustom ? "bg-brand text-black" : "border border-white/20 text-white/60"
          }`}
        >
          {editor.isCustom ? "Edited" : "Original"}
        </span>
      </div>

      <div className="space-y-5">{children}</div>

      <div
        className={`sticky bottom-0 z-10 -mx-5 mt-8 flex flex-wrap items-center gap-3 border-t px-5 py-4 backdrop-blur sm:-mx-7 sm:px-7 ${
          editor.dirty ? "border-brand bg-brand/15" : "border-white/10 bg-ink-soft/90"
        }`}
      >
        <button className="btn btn-yellow !py-2.5 text-sm disabled:opacity-40" onClick={editor.save} disabled={!editor.dirty || editor.busy}>
          {editor.busy ? "Working…" : "Save changes"}
        </button>
        <button className="btn btn-ghost !py-2.5 text-sm disabled:opacity-30" onClick={editor.revert} disabled={!editor.isCustom || editor.busy}>
          Revert to original
        </button>
        {editor.dirty && <span className="text-sm font-bold text-brand">Unsaved changes. Press Save changes to publish them.</span>}
        {editor.msg && <span className={`text-sm font-semibold ${editor.msg.ok ? "text-green-400" : "text-brand-red"}`}>{editor.msg.text}</span>}
      </div>
    </div>
  );
}

export function Card({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      {actions && <div className="mb-3 flex flex-wrap justify-end gap-2">{actions}</div>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
