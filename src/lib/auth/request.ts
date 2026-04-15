import { verifyAccessToken, type JwtPayload } from "./jwt";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import {
  accountInvalidPayload,
  invalidTokenPayload,
  unauthorizedPayload,
} from "@/lib/api-error-response";

export type AuthContext = {
  user: JwtPayload & { id: string };
  dbUser: typeof users.$inferSelect;
};

export async function getBearerToken(request: Request) {
  const h = request.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7);
}

export async function requireAuth(request: Request): Promise<AuthContext> {
  const token = await getBearerToken(request);
  if (!token) {
    throw new Response(JSON.stringify(unauthorizedPayload()), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  let payload: Awaited<ReturnType<typeof verifyAccessToken>>;
  try {
    payload = await verifyAccessToken(token);
  } catch {
    throw new Response(JSON.stringify(invalidTokenPayload()), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1);
  if (!row || !row.enabled) {
    throw new Response(JSON.stringify(accountInvalidPayload()), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return {
    user: { ...payload, id: payload.sub },
    dbUser: row,
  };
}

export function requireRole(
  ctx: AuthContext,
  ...roles: Array<"USER" | "ADMIN" | "MASTER_ADMIN">
) {
  const r = ctx.dbUser.role as "USER" | "ADMIN" | "MASTER_ADMIN";
  if (!roles.includes(r)) {
    throw new Response(JSON.stringify({ message: "Acesso negado" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }
}

export function requireAdminOrMaster(ctx: AuthContext) {
  requireRole(ctx, "ADMIN", "MASTER_ADMIN");
}

export function requireMaster(ctx: AuthContext) {
  requireRole(ctx, "MASTER_ADMIN");
}
