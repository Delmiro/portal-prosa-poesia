import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

function uploadRoot() {
  return join(process.cwd(), process.env.UPLOAD_DIR ?? "uploads");
}

export function kindFromMime(mime: string) {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  return "OTHER";
}

export async function saveUploadedFile(
  bytes: Buffer,
  originalName: string,
): Promise<{ relativePath: string }> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const rel = join(String(y), m, `${randomUUID()}-${safe}`);
  const root = uploadRoot();
  const abs = join(root, rel);
  await mkdir(join(root, String(y), m), { recursive: true });
  await writeFile(abs, bytes);
  return { relativePath: rel.replace(/\\/g, "/") };
}

export async function readStoredFile(relativePath: string) {
  const abs = join(uploadRoot(), relativePath);
  return readFile(abs);
}

export async function deleteStoredFile(relativePath: string) {
  const abs = join(uploadRoot(), relativePath);
  await unlink(abs).catch(() => {});
}
