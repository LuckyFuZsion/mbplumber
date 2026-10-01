/** Add Cloudinary delivery transforms (auto format/quality + width) to a Cloudinary URL. Other URLs pass through. */
export function cldUrl(url: string, width: number) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
}
