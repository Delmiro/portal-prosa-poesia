/** Erros típicos do cliente `pg` quando o servidor PostgreSQL não está acessível. */
const PG_DOWN_CODES = new Set([
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
]);

function hasCode(err: unknown, code: string): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as NodeJS.ErrnoException).code === code
  );
}

/**
 * Indica falha de ligação ao PostgreSQL (serviço parado, porta errada, host errado).
 */
export function isDatabaseUnreachable(err: unknown): boolean {
  if (hasCode(err, "ECONNREFUSED") || hasCode(err, "ETIMEDOUT")) {
    return true;
  }
  if (err instanceof AggregateError && Array.isArray(err.errors)) {
    return err.errors.some(
      (e) =>
        hasCode(e, "ECONNREFUSED") ||
        hasCode(e, "ETIMEDOUT") ||
        hasCode(e, "ENOTFOUND"),
    );
  }
  if (typeof err === "object" && err !== null && "code" in err) {
    const c = (err as NodeJS.ErrnoException).code;
    return typeof c === "string" && PG_DOWN_CODES.has(c);
  }
  return false;
}

export const databaseUnreachableMessage =
  "Não foi possível ligar ao PostgreSQL. Arranque a base de dados (ex.: na raiz do projeto: docker compose up -d db) e confirme que DATABASE_URL em .env.local aponta para o host e porta corretos (ex.: postgresql://portal:portal@localhost:5432/portal).";
