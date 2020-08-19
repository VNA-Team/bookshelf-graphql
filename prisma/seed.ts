import { PrismaClient } from '@prisma/client';
import faker from 'faker';

const PASSWORD = '$2b$12$6P/Y3/9uIp3jS6C1vNvuxuWda54tu9TZr8AbNcvCHjPWZU1BsXQfm'; // Abc123@@

const prisma = new PrismaClient();

async function seedUsers() {
  const usersData = [
    { email: 'lednhatkhanh@gmail.com', password: PASSWORD, username: 'lednhatkhanh' },
    ...Array.from({ length: 60 }, () => ({
      email: faker.internet.email().toLowerCase(),
      username: faker.internet.userName().toLowerCase(),
      password: PASSWORD,
    })),
  ];

  try {
    console.log('Clearing user table...');
    await prisma.user.deleteMany({ where: { email: { not: '' } } });
    console.log('User table cleared');

    console.log('seeding user table...');
    const users = await prisma.$transaction(usersData.map((data) => prisma.user.create({ data })));
    console.log('Seeding users succeed');

    return users;
  } catch (error) {
    console.log('Failed to seed users', error);
  }
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function triggerSeed() {
  await seedUsers();
  process.exit();
}

triggerSeed();
