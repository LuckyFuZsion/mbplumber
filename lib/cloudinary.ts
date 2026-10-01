import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const GALLERY_TAG = "mbp-gallery";

export type GalleryItem = {
  id: string; // Cloudinary public_id
  url: string; // base delivery URL (no transforms)
  width: number;
  height: number;
  caption: string;
  category: string;
  createdAt: string;
};

export function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

export function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

/** Fetch all gallery images (tagged `mbp-gallery`), newest first. Captions live in Cloudinary "context". */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!cloudinaryConfigured()) return [];
  try {
    const res = await getCloudinary()
      .search.expression(`tags=${GALLERY_TAG} AND resource_type:image`)
      .with_field("context")
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    return (res.resources as Array<Record<string, any>>).map((r) => ({
      id: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      caption: r.context?.caption ?? "",
      category: r.context?.category ?? "General Plumbing",
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error("Cloudinary gallery fetch failed", err);
    return [];
  }
}
