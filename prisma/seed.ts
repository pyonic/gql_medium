import { PrismaClient, Role, User } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon2 from 'argon2';
import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';

config();

async function main() {
  const DEFAULT_USER = {
    name: 'Super Admin',
    email: 'super.admin@ax.com',
    password: 'root',
    role: Role.admin,
  };

  await prisma.user.deleteMany({ where: { email: DEFAULT_USER.email } });

  DEFAULT_USER.password = await argon2.hash(DEFAULT_USER.password);
  const user: User = await prisma.user.create({ data: DEFAULT_USER });
  const token = sign(
    { email: DEFAULT_USER.email, role: DEFAULT_USER.role },
    process.env.JWT_ACCESS_SECRET,
  );

  console.log(`-----DEFAULT DATA-----`);

  console.log(`USER: ${JSON.stringify(user)}`);
  console.log(`TOKEN: ${token}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
