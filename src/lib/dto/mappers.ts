import type { profiles, users } from "@/db/schema";

export function userResponse(
  u: typeof users.$inferSelect,
  p: typeof profiles.$inferSelect | null,
) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    enabled: u.enabled,
    createdAt: u.createdAt?.toISOString?.() ?? String(u.createdAt),
    profile: p
      ? {
          id: p.id,
          bio: p.bio,
          avatarMediaId: p.avatarMediaId,
          socialLinksJson: p.socialLinksJson,
        }
      : null,
  };
}
