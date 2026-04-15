import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
  const s =
    process.env.JWT_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "dev-only-jwt-secret-change-me-min-32-chars!!"
      : undefined);
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET deve ter pelo menos 32 caracteres");
  }
  return new TextEncoder().encode(s);
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN" | "MASTER_ADMIN";
};

export async function signAccessToken(payload: JwtPayload, expiresIn = "24h") {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  const sub = payload.sub;
  const email = payload.email as string;
  const role = payload.role as JwtPayload["role"];
  if (!sub || !email || !role) {
    throw new Error("Token inválido");
  }
  return { sub, email, role };
}
