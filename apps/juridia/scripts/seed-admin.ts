// Seed do administrador real do JuridIA (uso operacional, não demonstração).
//
// Uso:
//   EJC_ADMIN_EMAIL="ops@dominio.adv.br" EJC_ADMIN_PASSWORD="..." EJC_ADMIN_NAME="..." \
//     bunx tsx scripts/seed-admin.ts
//
// - Não cria dados fictícios (política de dados do projeto).
// - Idempotente: atualiza nome/senha se o e-mail já existir; role sempre admin.
// - A senha vive apenas no ambiente protegido do servidor (nunca no Git/chat).
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

async function main() {
  const email = process.env.EJC_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.EJC_ADMIN_PASSWORD || "";
  const name = process.env.EJC_ADMIN_NAME?.trim() || null;

  if (!email || !password) {
    console.error("Uso: EJC_ADMIN_EMAIL=... EJC_ADMIN_PASSWORD=... bunx tsx scripts/seed-admin.ts");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("EJC_ADMIN_PASSWORD deve ter ao menos 12 caracteres.");
    process.exit(1);
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    await db.user.update({
      where: { email },
      data: { passwordHash: hashPassword(password), role: "admin", ...(name ? { name } : {}) },
    });
    console.log(`[seed-admin] admin atualizado: ${email}`);
  } else {
    await db.user.create({
      data: { email, name, role: "admin", passwordHash: hashPassword(password) },
    });
    console.log(`[seed-admin] admin criado: ${email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
