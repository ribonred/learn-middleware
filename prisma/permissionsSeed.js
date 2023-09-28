const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const defaultPerm = [
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
  ]
  await prisma.permission.createMany({
    data: defaultPerm,
    skipDuplicates: true,
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })