const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.permission.createMany(
        {
            data: [
                {
                    name: 'superuser',
                    type: 'ROLE',
                },
                {
                    name: 'staff',
                    type: 'ROLE',
                },
                {
                    name: 'user',
                    type: 'ROLE',
                }
            ],
            skipDuplicates: true,
        }
    )
});

afterEach(async () => {
    await prisma.permission.deleteMany();
});