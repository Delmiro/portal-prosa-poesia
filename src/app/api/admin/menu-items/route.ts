import { NextResponse } from "next/server";
import { z } from "zod";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { menuItems } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
const Item = z.object({
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(512),
  placement: z.enum([
    "MAIN",
    "QUICK",
    "FOOTER_REVISTA",
    "FOOTER_CONTEUDO",
    "FOOTER_CONTACTO",
  ]),
  sortOrder: z.number().int(),
  visible: z.boolean(),
});

const PutBody = z.array(Item);

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const db = getDb();
  const rows = await db.select().from(menuItems).orderBy(asc(menuItems.sortOrder));
  return NextResponse.json(
    rows.map((m) => ({
      id: m.id,
      label: m.label,
      href: m.href,
      placement: m.placement,
      sortOrder: m.sortOrder,
      visible: m.visible,
    })),
  );
}

export async function PUT(request: Request) {
  try {
    const ctx = await requireAuth(request);
    requireAdminOrMaster(ctx);
    const items = PutBody.parse(await request.json());
    const db = getDb();
    await db.transaction(async (tx) => {
      await tx.delete(menuItems);
      if (items.length > 0) {
        await tx.insert(menuItems).values(
          items.map((i) => ({
            label: i.label.trim(),
            href: i.href.trim(),
            placement: i.placement,
            sortOrder: i.sortOrder,
            visible: i.visible,
          })),
        );
      }
    });
    const rows = await db.select().from(menuItems).orderBy(asc(menuItems.sortOrder));
    return NextResponse.json(
      rows.map((m) => ({
        id: m.id,
        label: m.label,
        href: m.href,
        placement: m.placement,
        sortOrder: m.sortOrder,
        visible: m.visible,
      })),
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}
