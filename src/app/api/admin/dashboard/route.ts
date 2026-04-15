import { NextResponse } from "next/server";
import { count, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { magazines, sitePages, users } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const db = getDb();
  const [{ u }] = await db.select({ u: count() }).from(users);
  const [{ p }] = await db.select({ p: count() }).from(sitePages);
  const [{ m }] = await db.select({ m: count() }).from(magazines);
  const recentUsers = await db
    .select({ email: users.email, updatedAt: users.updatedAt })
    .from(users)
    .orderBy(desc(users.updatedAt))
    .limit(3);
  const recentMag = await db
    .select({ title: magazines.title, updatedAt: magazines.updatedAt })
    .from(magazines)
    .orderBy(desc(magazines.updatedAt))
    .limit(2);
  const activities = [
    ...recentUsers.map((r) => ({
      type: "USER" as const,
      description: `Utilizador ${r.email}`,
      at: r.updatedAt?.toISOString?.() ?? "",
    })),
    ...recentMag.map((r) => ({
      type: "MAGAZINE" as const,
      description: `Revista: ${r.title}`,
      at: r.updatedAt?.toISOString?.() ?? "",
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  return NextResponse.json({
    userCount: Number(u),
    sitePageCount: Number(p),
    magazineCount: Number(m),
    recentActivities: activities.slice(0, 8),
  });
}
