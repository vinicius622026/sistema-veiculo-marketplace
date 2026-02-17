require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async function main() {
  const id = process.argv[2];
  const email = process.argv[3] || 'testuser+dev@local.test';

  if (!id) {
    console.error('Usage: node scripts/create-prisma-user.js <id> [email]');
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { id },
    update: { email },
    create: {
      id,
      email,
      full_name: email.split('@')[0],
      tipo_usuario: 'cliente'
    },
  });

  console.log('user ensured:', user);
})().catch((err) => {
  console.error(err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
