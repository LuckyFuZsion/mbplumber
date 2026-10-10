"use client";

import { useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { projectCover, type Project, type ProjectImage } from "@/lib/projects";
import { cldUrl } from "@/lib/img";
import { useConfirm } from "./Confirm";
import { uploadProjectPhoto } from "./imageUpload";
import { Card, Field, fieldClass, MiniButton, move, removeAt, SectionShell, setAt, useSectionEditor } from "./ui";

const STAGES = [
  { value: "Complete", label: "Complete (finished job)" },
  { value: "Before", label: "Before" },
  { value: "After", label: "After" },
] as const;

export function ProjectsEditor({ value, customised, cloudinary }: { value: SiteContent["projects"]; customised: boolean; cloudinary: boolean }) {
  const ed = useSectionEditor("projects", value, customised);
  const d = ed.draft;
  const set = (p: Partial<typeof d>) => ed.setDraft({ ...d, ...p });
  const setProject = (i: number, p: Partial<Project>) => set({ items: setAt(d.items, i, p) });
  const [open, setOpen] = useState<number | null>(null);
  const ask = useConfirm();

  return (
    <SectionShell
      title="Projects"
      help="Each project has its own page with a photo gallery. The first four show on the home page, so put your best work first. Photos are shrunk to WebP under 100KB automatically."
      editor={ed}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Projects page heading" value={d.title} onChange={(v) => set({ title: v })} />
        <Field label="Projects page intro" value={d.intro} onChange={(v) => set({ intro: v })} />
      </div>

      {!cloudinary && (
        <p className="rounded-xl border border-brand-red bg-brand-red/10 p-4 text-sm font-semibold">Photo uploads aren&apos;t set up yet (Cloudinary settings are missing).</p>
      )}

      <div className="space-y-4">
        {d.items.map((p, i) => (
          <ProjectCard
            key={p.slug || `new-${i}`}
            project={p}
            index={i}
            total={d.items.length}
            isOpen={open === i}
            cloudinary={cloudinary}
            onToggle={() => setOpen(open === i ? null : i)}
            onChange={(patch) => setProject(i, patch)}
            onMove={(dir) => (set({ items: move(d.items, i, dir) }), setOpen(null))}
            onRemove={async () => {
              const cover = projectCover(p);
              const yes = await ask({
                title: "Delete this project?",
                name: p.title || "Untitled project",
                detail: `${p.images.length} photo${p.images.length === 1 ? "" : "s"}${p.slug ? ` · /projects/${p.slug}` : ""}`,
                image: cover ? cldUrl(cover.file, 160) : undefined,
                message: "The project and its page disappear from the site once you press Save changes. You can undo it from the History tab.",
              });
              if (yes) {
                set({ items: removeAt(d.items, i) });
                setOpen(null);
              }
            }}
          />
        ))}
        <MiniButton
          onClick={() => {
            set({ items: [...d.items, { slug: "", title: "", summary: "", cover: 0, images: [] }] });
            setOpen(d.items.length);
          }}
        >
          + Add a project
        </MiniButton>
      </div>
    </SectionShell>
  );
}

function ProjectCard({
  project: p,
  index,
  total,
  isOpen,
  cloudinary,
  onToggle,
  onChange,
  onMove,
  onRemove,
}: {
  project: Project;
  index: number;
  total: number;
  isOpen: boolean;
  cloudinary: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<Project>) => void;
  onMove: (dir: number) => void;
  onRemove: () => void;
}) {
  const cover = p.images[p.cover] ?? p.images[0];
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const ask = useConfirm();

  const setImage = (i: number, patch: Partial<ProjectImage>) => onChange({ images: setAt(p.images, i, patch) });

  function moveImage(i: number, dir: number) {
    const coverFile = p.images[p.cover]?.file;
    const images = move(p.images, i, dir);
    onChange({ images, cover: Math.max(0, images.findIndex((im) => im.file === coverFile)) });
  }

  async function removeImage(i: number) {
    const im = p.images[i];
    const yes = await ask({
      title: "Delete this photo?",
      name: im.alt || `Photo ${i + 1} of ${p.images.length}`,
      detail: `In project: ${p.title || "Untitled project"}`,
      image: cldUrl(im.file, 160),
      message: "It is removed from the project once you press Save changes. The file itself stays safely stored.",
    });
    if (!yes) return;
    const coverFile = p.images[p.cover]?.file;
    const images = removeAt(p.images, i);
    onChange({ images, cover: Math.max(0, images.findIndex((im) => im.file === coverFile)) });
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const added: ProjectImage[] = [];
    const list = Array.from(files);
    for (let n = 0; n < list.length; n++) {
      setStatus(`Preparing photo ${n + 1} of ${list.length}…`);
      try {
        const up = await uploadProjectPhoto(list[n]);
        added.push({ ...up, stage: "Complete", alt: "" });
        onChange({ images: [...p.images, ...added] });
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "Upload failed.");
        setBusy(false);
        return;
      }
    }
    setStatus(`${added.length} photo${added.length === 1 ? "" : "s"} added. Remember to press Save changes.`);
    setBusy(false);
  }

  return (
    <Card
      actions={
        <>
          <MiniButton onClick={() => onMove(-1)} disabled={index === 0}>↑ Up</MiniButton>
          <MiniButton onClick={() => onMove(1)} disabled={index === total - 1}>↓ Down</MiniButton>
          <MiniButton danger onClick={onRemove}>Remove project</MiniButton>
        </>
      }
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-4 text-left">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cldUrl(cover.file, 160)} alt="" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-white/20 text-xs text-white/40">No photo</span>
        )}
        <span className="flex-1">
          <span className="block font-extrabold">{p.title || "Untitled project"}</span>
          <span className="block text-xs text-white/50">
            #{index + 1} · {p.images.length} photo{p.images.length === 1 ? "" : "s"}
            {p.slug && ` · /projects/${p.slug}`}
          </span>
        </span>
        <span className="text-sm font-bold text-brand">{isOpen ? "Close ▲" : "Edit ▼"}</span>
      </button>

      {isOpen && (
        <div className="space-y-5 border-t border-white/10 pt-5">
          <Field label="Project name" value={p.title} onChange={(v) => onChange({ title: v })} placeholder="e.g. Walk-in shower, Harlaxton" />
          <Field label="Description" value={p.summary} onChange={(v) => onChange({ summary: v })} textarea rows={3} placeholder="What was done, area, anything worth mentioning." />

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-white/60">Photos</h4>
              <div className="flex items-center gap-3">
                <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ""))} />
                <button type="button" className="btn btn-yellow !px-4 !py-2 text-sm disabled:opacity-40" disabled={busy || !cloudinary} onClick={() => input.current?.click()}>
                  {busy ? "Uploading…" : "+ Add photos"}
                </button>
              </div>
            </div>
            {status && <p className="mb-3 text-sm font-semibold text-white/70">{status}</p>}

            {p.images.length === 0 ? (
              <p className="text-sm text-white/50">No photos yet. Choose as many as you like at once.</p>
            ) : (
              <div className="space-y-3">
                {p.images.map((im, i) => (
                  <div key={im.file + i} className="flex flex-col gap-3 rounded-lg border border-white/10 p-3 sm:flex-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cldUrl(im.file, 300)} alt="" className="h-32 w-full rounded-md object-cover sm:w-40" />
                    <div className="flex-1 space-y-3">
                      <Field label="Photo description" value={im.alt} onChange={(v) => setImage(i, { alt: v })} placeholder="What the photo shows (helps Google and screen readers)" />
                      <div className="flex flex-wrap items-end gap-3">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-white/60">Label</span>
                          <select className={fieldClass} value={im.stage} onChange={(e) => setImage(i, { stage: e.target.value as ProjectImage["stage"] })}>
                            {STAGES.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </label>
                        <label className="flex items-center gap-2 pb-2 text-sm font-bold">
                          <input type="radio" name={`cover-${index}`} checked={p.cover === i} onChange={() => onChange({ cover: i })} /> Cover photo
                        </label>
                        <div className="ml-auto flex gap-2 pb-1">
                          <MiniButton onClick={() => moveImage(i, -1)} disabled={i === 0}>←</MiniButton>
                          <MiniButton onClick={() => moveImage(i, 1)} disabled={i === p.images.length - 1}>→</MiniButton>
                          <MiniButton danger onClick={() => removeImage(i)}>Remove</MiniButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
