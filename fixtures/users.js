const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const User = require("../models/User");

beforeEach(async () => {

    await prisma.user.createMany({
        data: [{
            username: 'testUser',
            email: 'testUser@example.com',
            password: User.make_password('testPassword'),
        },
        {
            username: 'adminUser',
            email: 'adminUser@example.com',
            password: User.make_password('adminPassword'),
        }
        ],
        skipDuplicates: true,
    });
});

afterEach(async () => {
    await prisma.user.deleteMany();
});
