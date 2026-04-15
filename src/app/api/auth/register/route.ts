import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { userResponse } from "@/lib/dto/mappers";
import { loadProfile } from "@/lib/profile-loader";
import { emailSchema } from "@/lib/validation/email";

const Body = z.object({
  email: emailSchema,
  password: z.string().min(6),
  name: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password, name } = Body.parse(json);
    const db = getDb();
    const em = email.trim().toLowerCase();
    const [exists] = await db.select().from(users).where(eq(users.email, em)).limit(1);
    if (exists) {
      return NextResponse.json({ message: "E-mail já registado" }, { status: 400 });
    }
    const hash = await hashPassword(password);
    const [u] = await db
      .insert(users)
      .values({
        email: em,
        passwordHash: hash,
        name: name.trim(),
        role: "USER",
        enabled: true,
      })
      .returning();
    await db.insert(profiles).values({ userId: u.id });
    const profile = await loadProfile(u.id);
    const token = await signAccessToken({
      sub: u.id,
      email: u.email,
      role: "USER",
    });
    return NextResponse.json({
      accessToken: token,
      tokenType: "Bearer",
      expiresInSeconds: 86400,
      user: userResponse(u, profile),
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos", issues: e.issues }, { status: 400 });
    }
    throw e;
  }
}
