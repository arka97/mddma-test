import { supabase } from "@/integrations/supabase/client";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export class UploadValidationError extends Error {}

function validateFile(file: File, allowVideo = false) {
  const type = (file.type || "").toLowerCase();
  // Explicitly block SVG and any non-allowlisted type. SVGs can embed scripts.
  if (type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    throw new UploadValidationError("SVG files are not allowed.");
  }
  const isVideo = type.startsWith("video/");
  const allowed = allowVideo
    ? ALLOWED_IMAGE_TYPES.has(type) || ALLOWED_VIDEO_TYPES.has(type)
    : ALLOWED_IMAGE_TYPES.has(type);
  if (!allowed) {
    throw new UploadValidationError(
      `Unsupported file type${type ? ` (${type})` : ""}. Use JPEG, PNG, WEBP${allowVideo ? ", or MP4" : " or GIF"}.`,
    );
  }
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    throw new UploadValidationError(`File is too large (max ${mb} MB).`);
  }
}

export async function uploadFile(
  bucket: "avatars" | "company-assets" | "product-images" | "ad-assets",
  userId: string,
  file: File,
): Promise<string | null> {
  try {
    validateFile(file, bucket === "product-images");
  } catch (e) {
    console.error("upload validation failed", e);
    return null;
  }
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) {
    console.error("upload error", error);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}
