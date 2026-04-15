import { NextResponse } from "next/server";
import { asc, count, ilike, or } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { requireAuth, requireMaster } from "@/lib/auth/request";

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireMaster(ctx);
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const size = Math.min(100, Math.max(1, Number(searchParams.get("size") ?? 20)));
  const db = getDb();
  const filter = q
    ? or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))
    : undefined;
  const base = db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      enabled: users.enabled,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.email));
  const rows = await (filter ? base.where(filter) : base).limit(size).offset(page * size);
  const countBase = db.select({ total: count() }).from(users);
  const [{ total }] = await (filter ? countBase.where(filter) : countBase);
  return NextResponse.json({
    content: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt?.toISOString?.() ?? String(r.createdAt),
    })),
    totalElements: Number(total),
  });
}
