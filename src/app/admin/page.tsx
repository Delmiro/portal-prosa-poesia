"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/admin/token";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">A redirecionar…</p>
    </div>
  );
}
