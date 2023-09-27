const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const User = require("../models/User");

beforeEach(async () => {
    await prisma.user.create({
        data: {
            username: 'testUser',
            email: 'testUser@example.com',
            password: User.make_password('testPassword'),
        },
    });
});

afterEach(async () => {
    await prisma.user.deleteMany({
        where: {
            username: 'testUser',
        },
    });
});