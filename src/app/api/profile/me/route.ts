import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { requireAuth } from "@/lib/auth/request";
import { userResponse } from "@/lib/dto/mappers";
import { loadProfile } from "@/lib/profile-loader";

const Body = z.object({
  bio: z.string().max(8000).optional().nullable(),
  avatarMediaId: z.string().uuid().optional().nullable(),
  socialLinksJson: z.string().max(4000).optional().nullable(),
});

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  const u = ctx.dbUser;
  const p = await loadProfile(u.id);
  return NextResponse.json(userResponse(u, p));
}

export async function PUT(request: Request) {
  try {
    const ctx = await requireAuth(request);
    const data = Body.parse(await request.json());
    const db = getDb();
    const [p] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, ctx.dbUser.id))
      .limit(1);
    if (!p) {
      await db.insert(profiles).values({ userId: ctx.dbUser.id });
    }
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (data.bio !== undefined) patch.bio = data.bio;
    if (data.avatarMediaId !== undefined) patch.avatarMediaId = data.avatarMediaId;
    if (data.socialLinksJson !== undefined) patch.socialLinksJson = data.socialLinksJson;
    await db.update(profiles).set(patch).where(eq(profiles.userId, ctx.dbUser.id));
    const pr = await loadProfile(ctx.dbUser.id);
    return NextResponse.json(userResponse(ctx.dbUser, pr));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}
