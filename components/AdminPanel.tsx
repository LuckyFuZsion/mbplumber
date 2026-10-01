"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GALLERY_CATEGORIES } from "@/lib/site";
import { cldUrl } from "@/lib/img";
import type { GridItem } from "./GalleryGrid";

const field =
  "w-full rounded-lg border border-white/20 bg-black px-3 py-2.5 text-sm font-medium text-white placeholder:text-white/40 focus:border-brand focus:outline-none";

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setErr((await res.json().catch(() => ({}))).error ?? "Login failed.");
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-ink-soft p-8">
      <h1 className="heading mb-6 text-3xl">Gallery admin</h1>
      <label className="mb-2 block text-sm font-bold" htmlFor="pw">
        Password
      </label>
      <input id="pw" type="password" className={field} value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
      {err && <p className="mt-3 text-sm font-semibold text-brand-red">{err}</p>}
      <button className="btn btn-yellow mt-6 w-full" disabled={busy || !pw}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

type Draft = { file: File; preview: string; caption: string; category: string; status: "ready" | "uploading" | "done" | "error" };

export function AdminPanel({ items, configured }: { items: (GridItem & { createdAt?: string })[]; configured: boolean }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [msg, setMsg] = useState("");

  function pick(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map<Draft>((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      category: GALLERY_CATEGORIES[0],
      status: "ready",
    }));
    setDrafts((d) => [...d, ...next]);
  }

  const patch = (i: number, p: Partial<Draft>) => setDrafts((d) => d.map((x, j) => (j === i ? { ...x, ...p } : x)));

  async function uploadAll() {
    setMsg("");
    for (let i = 0; i < drafts.length; i++) {
      const d = drafts[i];
      if (d.status === "done") continue;
      patch(i, { status: "uploading" });
      try {
        const sigRes = await fetch("/api/admin/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption: d.caption, category: d.category }),
        });
        const sig = await sigRes.json();
        if (!sigRes.ok) throw new Error(sig.error);

        const fd = new FormData();
        fd.append("file", d.file);
        for (const k of ["api_key", "timestamp", "signature", "folder", "tags", "context"]) {
          fd.append(k, k === "api_key" ? sig.apiKey : sig[k]);
        }
        const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: fd });
        if (!up.ok) throw new Error((await up.json().catch(() => ({}))).error?.message ?? "Upload failed");
        patch(i, { status: "done" });
      } catch (e) {
        patch(i, { status: "error" });
        setMsg(e instanceof Error ? e.message : "Upload failed");
      }
    }
    await fetch("/api/admin/photo", { method: "POST" });
    setDrafts((d) => d.filter((x) => x.status !== "done"));
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="heading text-3xl sm:text-4xl">Gallery admin</h1>
        <button onClick={logout} className="btn btn-ghost !py-2 text-sm">
          Sign out
        </button>
      </div>

      {!configured && (
        <p className="mb-8 rounded-xl border border-brand-red bg-brand-red/10 p-4 text-sm font-semibold">
          Cloudinary isn&apos;t configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to
          .env.local and restart.
        </p>
      )}

      <div className="mb-12 rounded-2xl border border-white/10 bg-ink-soft p-6">
        <h2 className="mb-1 text-xl font-extrabold">Add photos</h2>
        <p className="mb-4 text-sm text-white/60">Choose one or more photos, add a caption to each, then upload.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => (pick(e.target.files), (e.target.value = ""))}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-5 file:py-2.5 file:font-extrabold file:text-black"
        />

        {drafts.length > 0 && (
          <div className="mt-6 space-y-4">
            {drafts.map((d, i) => (
              <div key={d.preview} className="flex flex-col gap-4 rounded-xl border border-white/10 p-3 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.preview} alt="" className="h-28 w-full rounded-lg object-cover sm:w-40" />
                <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_200px]">
                  <input
                    className={field}
                    placeholder="Caption shown on the site, e.g. New walk-in shower, Grantham"
                    value={d.caption}
                    onChange={(e) => patch(i, { caption: e.target.value })}
                  />
                  <select className={field} value={d.category} onChange={(e) => patch(i, { category: e.target.value })}>
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50 sm:col-span-2">
                    {d.status === "uploading" ? "Uploading…" : d.status === "error" ? "Failed" : d.status === "done" ? "Uploaded" : d.file.name}
                  </p>
                </div>
                <button className="self-start text-sm font-bold text-white/50 hover:text-brand-red" onClick={() => setDrafts((x) => x.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
            ))}
            <button className="btn btn-red" onClick={uploadAll} disabled={!configured || drafts.some((d) => d.status === "uploading")}>
              Upload {drafts.length} photo{drafts.length > 1 ? "s" : ""}
            </button>
            {msg && <p className="text-sm font-semibold text-brand-red">{msg}</p>}
          </div>
        )}
      </div>

      <h2 className="mb-4 text-xl font-extrabold">Live gallery ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-white/60">No photos yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <ExistingPhoto key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExistingPhoto({ item }: { item: GridItem }) {
  const router = useRouter();
  const [caption, setCaption] = useState(item.caption);
  const [category, setCategory] = useState(item.category);
  const [busy, setBusy] = useState(false);
  const dirty = caption !== item.caption || category !== item.category;

  async function save() {
    setBusy(true);
    await fetch("/api/admin/photo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, caption, category }),
    });
    setBusy(false);
    router.refresh();
  }
  async function remove() {
    if (!confirm("Delete this photo permanently?")) return;
    setBusy(true);
    await fetch("/api/admin/photo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cldUrl(item.url, 500)} alt={item.caption} className="h-44 w-full object-cover" />
      <div className="space-y-2 p-3">
        <input className={field} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" />
        <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
          {Array.from(new Set([...GALLERY_CATEGORIES, category])).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex justify-between pt-1">
          <button onClick={save} disabled={!dirty || busy} className="btn btn-yellow !px-4 !py-2 text-sm disabled:opacity-40">
            Save
          </button>
          <button onClick={remove} disabled={busy} className="text-sm font-bold text-brand-red hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
