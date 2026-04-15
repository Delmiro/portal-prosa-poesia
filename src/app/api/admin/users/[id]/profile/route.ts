import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles, users } from "@/db/schema";
import { requireAuth, requireMaster } from "@/lib/auth/request";
import { userResponse } from "@/lib/dto/mappers";
import { loadProfile } from "@/lib/profile-loader";

const Body = z.object({
  bio: z.string().max(8000).optional().nullable(),
  avatarMediaId: z.string().uuid().optional().nullable(),
  socialLinksJson: z.string().max(4000).optional().nullable(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    requireMaster(auth);
    const { id } = await ctx.params;
    const data = Body.parse(await request.json());
    const db = getDb();
    const [u] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!u) {
      return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
    }
    const [p] = await db.select().from(profiles).where(eq(profiles.userId, id)).limit(1);
    if (!p) {
      await db.insert(profiles).values({ userId: id });
    }
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (data.bio !== undefined) patch.bio = data.bio;
    if (data.avatarMediaId !== undefined) patch.avatarMediaId = data.avatarMediaId;
    if (data.socialLinksJson !== undefined) patch.socialLinksJson = data.socialLinksJson;
    await db.update(profiles).set(patch).where(eq(profiles.userId, id));
    const pr = await loadProfile(id);
    return NextResponse.json(userResponse(u, pr));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}
