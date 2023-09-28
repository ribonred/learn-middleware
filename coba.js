const { prisma } = require('./models/extensions')
const User = require('./models/User')

async function main() {
    const data = await User.get(
        { username: "wgwtg" }
    )
    console.log(data, "data")
    const superUserPerm = await prisma.permission.findUnique({
        where: {
            name: 'superuser',
        },
    });
    await prisma.user.update({
        where: {
            username: data.username
        },
        data: {
            permissions: {
                connect: {
                    id: superUserPerm.id
                }
            }
        }
    })
    console.log(superUserPerm, "superUserPerm")
    console.log(await data.isSuperuser)
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



// it('should create superuser', (done) => {
//     User.get({ username: "admniUser" }).then((user) => {
//         prisma.permission.findUnique({ where: { name: 'superuser', }, }).then((superUserPerm) => {
//             prisma.user.update({
//                 where: {
//                     username: user.username
//                 },
//                 data: {
//                     permissions: {
//                         connect: {
//                             id: superUserPerm.id
//                         }
//                     }
//                 }
//             }).then((user) => {
//                 const { accesToken } = User.generateToken(user);
//                 chai.request(server)
//                     .get('/user/profile')
//                     .set('Authorization', 'Bearer ' + accesToken)
//                     .send()
//                     .end((err, res) => {

//                         expect(res.status).to.equal(200)
//                         expect(res.body.username).to.equal('testUser');
//                         done();
//                     });
//             })
//         })

//     });
// }, 10000);