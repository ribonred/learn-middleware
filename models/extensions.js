const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
    model: {
        $allModels: {
            async exists(where) {
                const context = Prisma.getExtensionContext(this)
                const result = await (context).findFirst({ where })
                return result !== null
            }
        },
    },
    result: {
        user: {
            isSuperuser: {
                async compute(user) {
                    const result = await prisma.user.findFirst({
                        where: {
                            id: user.id,
                            permissions: {
                                some: {
                                    name: {
                                        contains: 'superuser'
                                    }
                                }
                            }
                        },
                    })
                    return result !== null
                }

            }
        }
    }
});

exports.prisma = prisma