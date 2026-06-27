import { supabase } from "@/integrations/supabase/client";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const ALLOWED_PDF_TYPES = new Set(["application/pdf"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

export class UploadValidationError extends Error {}

export type UploadBucket =
  | "avatars"
  | "company-assets"
  | "product-images"
  | "ad-assets"
  | "circular-assets";

type ValidateOptions = { allowVideo?: boolean; allowPdf?: boolean };

export function validateFile(file: File, optsOrAllowVideo: boolean | ValidateOptions = false) {
  const opts: ValidateOptions = typeof optsOrAllowVideo === "boolean"
    ? { allowVideo: optsOrAllowVideo }
    : optsOrAllowVideo;
  const type = (file.type || "").toLowerCase();
  if (type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    throw new UploadValidationError("SVG files are not allowed.");
  }
  const isVideo = type.startsWith("video/");
  const isPdf = type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const allowed =
    ALLOWED_IMAGE_TYPES.has(type) ||
    (opts.allowVideo && ALLOWED_VIDEO_TYPES.has(type)) ||
    (opts.allowPdf && ALLOWED_PDF_TYPES.has(type));
  if (!allowed) {
    const extras: string[] = ["JPEG", "PNG", "WEBP", "GIF"];
    if (opts.allowVideo) extras.push("MP4");
    if (opts.allowPdf) extras.push("PDF");
    throw new UploadValidationError(
      `Unsupported file type${type ? ` (${type})` : ""}. Use ${extras.join(", ")}.`,
    );
  }
  const limit = isVideo ? MAX_VIDEO_BYTES : isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    throw new UploadValidationError(`File is too large (max ${mb} MB).`);
  }
}

export async function uploadFile(
  bucket: UploadBucket,
  userId: string,
  file: File,
): Promise<string | null> {
  try {
    validateFile(file, {
      allowVideo: bucket === "product-images",
      allowPdf: bucket === "circular-assets",
    });
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
  // For private buckets (circular-assets), store only the path; callers mint
  // short-lived signed URLs on demand via signPrivatePath().
  if (bucket === "circular-assets") {
    return `private://${bucket}/${path}`;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

const SIGN_TTL_SECONDS = 60 * 60; // 1 hour
const signedUrlCache = new Map<string, { url: string; expires: number }>();

export async function signPrivatePath(stored: string | null | undefined): Promise<string | null> {
  if (!stored) return null;
  // Legacy: long-lived signed URLs already stored in the DB — return as-is.
  if (!stored.startsWith("private://")) return stored;
  const rest = stored.slice("private://".length);
  const slash = rest.indexOf("/");
  if (slash < 0) return null;
  const bucket = rest.slice(0, slash);
  const path = rest.slice(slash + 1);
  const cacheKey = `${bucket}/${path}`;
  const cached = signedUrlCache.get(cacheKey);
  if (cached && cached.expires > Date.now() + 60_000) return cached.url;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, SIGN_TTL_SECONDS);
  if (error || !data?.signedUrl) return null;
  signedUrlCache.set(cacheKey, { url: data.signedUrl, expires: Date.now() + SIGN_TTL_SECONDS * 1000 });
  return data.signedUrl;
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
