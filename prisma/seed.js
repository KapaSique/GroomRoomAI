const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('grooming', 10);
  
  const adminExists = await prisma.user.findUnique({
    where: { login: 'admin' },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        fullname: 'Administrator',
        login: 'admin',
        email: 'admin@groomroom.ai',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
