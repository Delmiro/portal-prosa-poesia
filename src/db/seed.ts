import bcrypt from "bcryptjs";
import { eq, count } from "drizzle-orm";
import { getDb } from "./index";
import { DEFAULT_MENU_SEED } from "@/lib/default-menu-seed";
import { menuItems, profiles, users } from "./schema";

async function main() {
  const db = getDb();
  const [{ c }] = await db.select({ c: count() }).from(users);
  if (Number(c) > 0) {
    console.log("Seed ignorado: já existem utilizadores.");
    process.exit(0);
  }
  const email = process.env.APP_ADMIN_EMAIL ?? "admin@localhost";
  const password = process.env.APP_ADMIN_PASSWORD ?? "ChangeMe123!";
  const hash = await bcrypt.hash(password, 12);
  const [u] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      passwordHash: hash,
      name: "Administrador",
      role: "MASTER_ADMIN",
      enabled: true,
    })
    .returning();
  await db.insert(profiles).values({
    userId: u.id,
    bio: "Conta inicial.",
  });
  await db.insert(menuItems).values(DEFAULT_MENU_SEED);
  console.log("Seed concluído:", email);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
