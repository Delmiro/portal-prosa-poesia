import { NextResponse } from "next/server";
import { getPublicMenuItems } from "@/lib/public-menu";

export async function GET() {
  const items = await getPublicMenuItems();
  return NextResponse.json(items);
}
