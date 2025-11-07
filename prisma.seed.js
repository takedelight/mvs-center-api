import "dotenv/config";

import { Faker, uk } from "@faker-js/faker";
import { PrismaClient } from "./src/generated/client.js";
import { types } from "./src/constants.js";

const faker = new Faker({ locale: uk });

const prisma = new PrismaClient();

const sanitize = (str) => String(str).replace(/\u0000/g, "");

async function main() {
  prisma.$connect();

  for (let i = 0; i < process.env.LIMIT; i++) {
    await prisma.statement.create({
      data: {
        name: sanitize(`Заявка №${i + 1}`),
        type: sanitize(faker.helpers.arrayElement(types)),
        priority: faker.number.int({ min: 1, max: 3 }),
        status: faker.datatype.boolean(),
        createdAt: faker.date.between({
          from: String(new Date("2000-05-01")),
          to: String(new Date("2025-11-04")),
        }),
        client: sanitize(faker.person.fullName()),
      },
    });
  }
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
