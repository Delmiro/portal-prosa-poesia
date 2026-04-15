import { z } from "zod";

/**
 * Aceita emails habituais e endereços locais (ex.: admin@localhost do seed).
 * O validador `.email()` do Zod rejeita domínios sem TLD.
 */
export const emailSchema = z
  .string()
  .trim()
  .min(3)
  .refine(
    (s) => {
      const parsed = z.string().email().safeParse(s);
      if (parsed.success) return true;
      return /^[^\s@]+@[^\s@]+$/.test(s);
    },
    { message: "Email inválido" },
  );
