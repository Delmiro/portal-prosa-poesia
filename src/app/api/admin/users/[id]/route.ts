import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { requireAuth, requireMaster } from "@/lib/auth/request";
import { userResponse } from "@/lib/dto/mappers";
import { loadProfile } from "@/lib/profile-loader";
import { emailSchema } from "@/lib/validation/email";

const PutBody = z.object({
  name: z.string().min(1).max(200),
  email: emailSchema,
  role: z.enum(["USER", "ADMIN", "MASTER_ADMIN"]),
  enabled: z.boolean(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [u] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!u) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  const p = await loadProfile(u.id);
  return NextResponse.json(userResponse(u, p));
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    requireMaster(auth);
    const { id } = await ctx.params;
    const body = PutBody.parse(await request.json());
    const db = getDb();
    const [existing] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
    }
    const email = body.email.trim().toLowerCase();
    if (email !== existing.email) {
      const [dup] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (dup) {
        return NextResponse.json({ message: "E-mail já em uso" }, { status: 400 });
      }
    }
    const [u] = await db
      .update(users)
      .set({
        name: body.name.trim(),
        email,
        role: body.role,
        enabled: body.enabled,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    const p = await loadProfile(u.id);
    return NextResponse.json(userResponse(u, p));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireMaster(auth);
  const { id } = await ctx.params;
  if (id === auth.dbUser.id) {
    return NextResponse.json({ message: "Não pode eliminar a sua própria conta" }, { status: 400 });
  }
  const db = getDb();
  const [existing] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!existing) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  await db.delete(users).where(eq(users.id, id));
  return new NextResponse(null, { status: 204 });
}
