import { supabase } from "@/integrations/supabase/client";

const BUCKET = "community-media";
export const MAX_IMAGE_MB = 5;
export const MAX_FILE_MB = 10;
export const MAX_IMAGES_PER_POST = 4;
const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface UploadedMedia {
  path: string;
  name: string;
  size: number;
  mime: string;
}

function extFromMime(mime: string): string {
  return ({
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/pdf": "pdf",
  } as Record<string, string>)[mime] ?? "bin";
}

export async function uploadPostImage(userId: string, file: File): Promise<UploadedMedia> {
  if (!IMAGE_MIME.includes(file.type)) throw new Error("Unsupported image type");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`Image > ${MAX_IMAGE_MB} MB`);
  const ext = file.name.split(".").pop() || extFromMime(file.type);
  const path = `posts/${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return { path, name: file.name, size: file.size, mime: file.type };
}

export async function uploadPostFile(userId: string, file: File): Promise<UploadedMedia> {
  if (file.type !== "application/pdf") throw new Error("Only PDF files are supported");
  if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`File > ${MAX_FILE_MB} MB`);
  const path = `posts/${userId}/files/${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return { path, name: file.name, size: file.size, mime: file.type };
}

const urlCache = new Map<string, { url: string; expires: number }>();

export async function getMediaSignedUrl(path: string, expiresInSec = 3600): Promise<string | null> {
  const cached = urlCache.get(path);
  const now = Date.now();
  if (cached && cached.expires > now + 30_000) return cached.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSec);
  if (error || !data?.signedUrl) return null;
  urlCache.set(path, { url: data.signedUrl, expires: now + expiresInSec * 1000 });
  return data.signedUrl;
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}
