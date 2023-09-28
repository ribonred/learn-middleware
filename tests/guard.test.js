const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require("../models/User");
const { prisma } = require('../models/extensions');
chai.use(chaiHttp);
const expect = require('chai').expect;
describe('Login', () => {
    require('../fixtures/users.js');
    require('../fixtures/permissions.js');
    it('should create superuser', (done) => {
        prisma.permission.findUnique({ where: { name: 'superuser', }, }).then((superUserPerm) => {
            prisma.user.update({
                where: {
                    username: "adminUser"
                },
                data: {
                    permissions: {
                        connect: {
                            id: superUserPerm.id
                        }
                    }
                }
            }).then((user) => {
                const { accesToken } = User.generateToken(user);
                chai.request(server)
                    .get('/user/admin')
                    .set('Authorization', 'Bearer ' + accesToken)
                    .send()
                    .end((err, res) => {
                        expect(res.status).to.equal(200)
                        expect(res.body.username).to.equal('adminUser');
                        done();
                    });
            })
        })

    }, 10000);
    it('should return user profile', (done) => {
        User.get({ username: "testUser" }).then((user) => {
            const { accesToken } = User.generateToken(user);
            chai.request(server)
                .get('/user/profile')
                .set('Authorization', 'Bearer ' + accesToken)
                .send()
                .end((err, res) => {

                    expect(res.status).to.equal(200)
                    expect(res.body.username).to.equal('testUser');
                    done();
                });
        });

    }, 10000);
    it('should return user profile using apikey', (done) => {
        chai.request(server)
            .get('/user/profile')
            .set('x-api-key', "1234")
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.username).to.equal('testUser');
                done();
            });

    }, 10000);
    it('should return 401 wrong using apikey', (done) => {
        chai.request(server)
            .get('/user/profile')
            .set('x-api-key', "123")
            .send()
            .end((err, res) => {
                expect(res.status).to.equal(401)
                done();
            });

    }, 10000);
});