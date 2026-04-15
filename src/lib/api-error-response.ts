/** Envelope alinhado com clientes que esperam `data` + `errors[]`. */
export function unauthorizedPayload() {
  return {
    data: null,
    message: "Não autenticado",
    errors: [
      {
        code: "AUTH_REQUIRED",
        message: "Autenticação obrigatória",
        detail:
          "Este endpoint requer autenticação. Forneça um token JWT válido no header Authorization: Bearer <token>.",
        field: null as string | null,
      },
    ],
  };
}

export function invalidTokenPayload() {
  return {
    data: null,
    message: "Token inválido",
    errors: [
      {
        code: "AUTH_INVALID",
        message: "Token inválido ou expirado",
        detail:
          "O JWT não pôde ser verificado. Volte a iniciar sessão em /admin/login.",
        field: null as string | null,
      },
    ],
  };
}

export function accountInvalidPayload() {
  return {
    data: null,
    message: "Conta inválida",
    errors: [
      {
        code: "ACCOUNT_INVALID",
        message: "Conta inválida ou desativada",
        detail: "O utilizador não existe ou está desativado.",
        field: null as string | null,
      },
    ],
  };
}
