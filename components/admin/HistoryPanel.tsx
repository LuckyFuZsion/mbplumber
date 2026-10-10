"use client";

import { useEffect, useState } from "react";
import type { ChangeGroup } from "@/lib/content-diff";
import { useConfirm } from "./Confirm";

type Version = { id: string; createdAt: number; note: string; by: string; groups: ChangeGroup[] };

const countChanges = (v: Version) => v.groups.reduce((n, g) => n + g.lines.length, 0);
const when = (t: number) => new Date(t).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function lineClass(line: string) {
  if (line.startsWith("Added")) return "text-green-400";
  if (line.startsWith("Removed")) return "text-brand-red";
  return "text-white/80";
}

/** Every save/revert takes a snapshot first, so any change can be undone by restoring the version just before it. */
export function HistoryPanel() {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const ask = useConfirm();

  useEffect(() => {
    fetch("/api/admin/history")
      .then((r) => r.json())
      .then((d: { versions?: Version[] }) => {
        const list = d.versions ?? [];
        setVersions(list);
        if (list[0]) setOpen({ [list[0].id]: true }); // newest change starts expanded
      })
      .catch(() => setVersions([]));
  }, []);

  async function restore(v: Version) {
    const n = countChanges(v);
    const yes = await ask({
      title: "Undo this change?",
      name: v.note,
      detail: `${when(v.createdAt)} · ${n} change${n === 1 ? "" : "s"}${v.groups.length ? ` in ${v.groups.map((g) => g.label).join(", ")}` : ""}`,
      message:
        "The site goes back to exactly how it was just before this change. Anything saved after it will be replaced, but you can undo this too.",
      confirmLabel: "Yes, undo it",
      danger: false,
    });
    if (!yes) return;
    setBusy(v.id);
    setErr("");
    const res = await fetch("/api/admin/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: v.id }) });
    if (res.ok) window.location.reload();
    else {
      setBusy("");
      setErr((await res.json().catch(() => ({}))).error ?? "Couldn't restore.");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft p-5 sm:p-7">
      <h2 className="text-xl font-extrabold">Version history</h2>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-white/55">
        Newest first. Each entry lists exactly what changed. &quot;Undo this change&quot; puts the site back to how it was just before it, and
        restoring is itself undoable.
      </p>
      {err && <p className="mb-4 text-sm font-semibold text-brand-red">{err}</p>}
      {versions === null ? (
        <p className="text-white/60">Loading…</p>
      ) : versions.length === 0 ? (
        <p className="text-white/60">No changes yet.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {versions.map((v) => {
            const n = countChanges(v);
            const expanded = !!open[v.id];
            return (
              <li key={v.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold">{v.note}</p>
                    <p className="text-xs text-white/50">
                      {when(v.createdAt)} · {v.by}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen({ ...open, [v.id]: !expanded })}
                      className="mt-2 text-sm font-bold text-brand hover:underline"
                      aria-expanded={expanded}
                    >
                      {n === 0 ? "No visible change" : `${expanded ? "Hide" : "Show"} ${n} change${n === 1 ? "" : "s"} ${expanded ? "▲" : "▼"}`}
                    </button>
                  </div>
                  <button className="btn btn-ghost !px-4 !py-2 text-sm" disabled={busy !== ""} onClick={() => restore(v)}>
                    {busy === v.id ? "Restoring…" : "Undo this change"}
                  </button>
                </div>

                {expanded && n > 0 && (
                  <div className="mt-3 space-y-4 rounded-xl border border-white/10 bg-black/40 p-4">
                    {v.groups.map((g) => (
                      <div key={g.key}>
                        <h3 className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-white/50">{g.label}</h3>
                        <ul className="space-y-1 text-sm">
                          {g.lines.map((line, i) => (
                            <li key={i} className={`break-words ${lineClass(line)}`}>
                              • {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
