const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require("../models/User");

chai.use(chaiHttp);
const expect = require('chai').expect;
describe('Login', () => {
  require('../fixtures/users.js');
  it('should return a token for valid username and password', (done) => {
    chai.request(server)
      .post('/user/login')
      .send({ username: 'testUser', password: 'testPassword' })
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.accesToken).to.be.a('string');
        done();
      });
  }, 10000);
  it('should return acess token for refresh token', (done) => {
    User.get({ username: "testUser" }).then((user) => {
      const { accesToken } = User.generateToken(user);
      chai.request(server)
        .post('/user/refreshtoken')
        .send({ refreshToken: accesToken })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.accesToken).to.be.a('string');
          done();
        });
    }, 10000);
  })

  it('should return an error for invalid username or password', (done) => {
    chai.request(server)
      .post('/user/login')
      .send({ username: 'testUser', password: 'invalidPassword' })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Invalid username or password');
        done();
      });
  }, 10000);
});
