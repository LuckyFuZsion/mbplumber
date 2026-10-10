"use client";

const LIMIT = 99_000; // bytes: every photo on the site stays under 100KB

/**
 * Shrinks a photo in the browser until it is WebP and under 100KB, then uploads it to Cloudinary.
 * Returns the delivery URL and final pixel size.
 */
async function shrink(file: File): Promise<{ blob: Blob; width: number; height: number; webp: boolean }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  let last: { blob: Blob; width: number; height: number; webp: boolean } | null = null;
  for (const side of [1600, 1400, 1200, 1000, 800, 640]) {
    const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
    for (const q of [0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.34]) {
      let blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", q));
      const webp = blob?.type === "image/webp";
      if (!webp) {
        // Browser can't write WebP: use JPEG, and Cloudinary converts to WebP on delivery.
        blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", q));
      }
      if (!blob) continue;
      last = { blob, width, height, webp };
      if (blob.size < LIMIT) return last;
    }
  }
  if (!last) throw new Error("Couldn't read that image.");
  return last;
}

export type UploadedImage = { file: string; width: number; height: number };

export async function uploadProjectPhoto(file: File): Promise<UploadedImage> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image.`);
  const { blob, width, height, webp } = await shrink(file);
  if (blob.size >= LIMIT * 1.05) throw new Error(`${file.name} couldn't be made small enough.`);

  const sigRes = await fetch("/api/admin/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "project" }),
  });
  const sig = await sigRes.json();
  if (!sigRes.ok) throw new Error(sig.error ?? "Couldn't start the upload.");

  const fd = new FormData();
  fd.append("file", blob, `photo.${webp ? "webp" : "jpg"}`);
  fd.append("api_key", sig.apiKey);
  for (const k of ["timestamp", "signature", "folder", "tags"]) fd.append(k, sig[k]);
  const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: fd });
  const data = await up.json().catch(() => ({}));
  if (!up.ok) throw new Error(data.error?.message ?? "Upload failed.");

  const url: string = data.secure_url;
  return {
    file: webp ? url : url.replace("/upload/", "/upload/f_webp,q_auto/"),
    width: data.width ?? width,
    height: data.height ?? height,
  };
}
