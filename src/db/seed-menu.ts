import { count } from "drizzle-orm";
import { getDb } from "./index";
import { menuItems } from "./schema";
import { DEFAULT_MENU_SEED } from "@/lib/default-menu-seed";

/**
 * Popula menu_items com o conteúdo padrão se a tabela estiver vazia.
 * Use após migrar a coluna `placement` (docker/postgres/migrate-001-menu-placement.sql).
 */
async function main() {
  const db = getDb();
  const [{ c }] = await db.select({ c: count() }).from(menuItems);
  if (Number(c) > 0) {
    console.log("Seed menu ignorado: já existem itens em menu_items.");
    process.exit(0);
  }
  await db.insert(menuItems).values(DEFAULT_MENU_SEED);
  console.log(`Menu inicial inserido: ${DEFAULT_MENU_SEED.length} itens.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
