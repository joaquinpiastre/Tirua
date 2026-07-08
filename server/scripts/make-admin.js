import prisma from '../src/config/database.js';

const email = process.argv[2];

if (!email) {
  console.error('Uso: node scripts/make-admin.js <email>');
  process.exit(1);
}

const normalizedEmail = email.trim().toLowerCase();

const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

if (!user) {
  console.error(`No existe ningún usuario con el email "${normalizedEmail}". Registrate primero en el sitio.`);
  process.exit(1);
}

await prisma.user.update({
  where: { email: normalizedEmail },
  data: { rol: 'admin' }
});

console.log(`Listo: ${normalizedEmail} ahora es admin.`);

await prisma.$disconnect();
