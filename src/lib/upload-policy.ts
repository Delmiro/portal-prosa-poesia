const MB = 1024 * 1024;

export const uploadPolicy = {
  coverImage: {
    maxBytes: 8 * MB,
    allowedMimePrefixes: ["image/"],
  },
  pdf: {
    maxBytes: 25 * MB,
    allowedMimes: ["application/pdf"],
  },
} as const;

export function isAllowedMime(
  mime: string,
  opts: { allowedMimes?: readonly string[]; allowedMimePrefixes?: readonly string[] },
) {
  if (opts.allowedMimes?.includes(mime)) return true;
  if (opts.allowedMimePrefixes?.some((prefix) => mime.startsWith(prefix))) return true;
  return false;
}
