import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { userResponse } from "@/lib/dto/mappers";
import { loadProfile } from "@/lib/profile-loader";
import {
  databaseUnreachableMessage,
  isDatabaseUnreachable,
} from "@/lib/db-connection-error";
import { emailSchema } from "@/lib/validation/email";

const Body = z.object({
  email: emailSchema,
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          message:
            "Base de dados não configurada. Copie .env.example para .env.local e defina DATABASE_URL (PostgreSQL em execução).",
        },
        { status: 503 },
      );
    }
    const json = await request.json();
    const { email, password } = Body.parse(json);
    const db = getDb();
    const [u] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);
    if (!u || !(await verifyPassword(password, u.passwordHash))) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 400 });
    }
    if (!u.enabled) {
      return NextResponse.json({ message: "Conta desativada" }, { status: 400 });
    }
    const token = await signAccessToken({
      sub: u.id,
      email: u.email,
      role: u.role as "USER" | "ADMIN" | "MASTER_ADMIN",
    });
    const profile = await loadProfile(u.id);
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
    if (e instanceof Error && e.message.includes("DATABASE_URL")) {
      return NextResponse.json(
        {
          message:
            "Base de dados não configurada. Copie .env.example para .env.local e defina DATABASE_URL.",
        },
        { status: 503 },
      );
    }
    if (isDatabaseUnreachable(e)) {
      return NextResponse.json({ message: databaseUnreachableMessage }, { status: 503 });
    }
    throw e;
  }
}
