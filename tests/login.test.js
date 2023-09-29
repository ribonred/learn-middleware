const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require("../models/User");

chai.use(chaiHttp);
const expect = require('chai').expect;
describe('Login', () => {
  require('../fixtures/users.js');
  it('should return a token for valid email and password', (done) => {
    chai.request(server)
      .post('/user/login')
      .send({ email: 'testUser@example.com', password: 'testPassword' })
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.accesToken).to.be.a('string');
        done();
      });
  }, 10000);
  it('should return acess token for refresh token', (done) => {
    User.get({ email: "testUser@example.com" }).then((user) => {
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

  it('should return an error for invalid email or password', (done) => {
    chai.request(server)
      .post('/user/login')
      .send({ email: 'testUser@example.com', password: 'invalidPassword' })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('Invalid username or password');
        done();
      });
  }, 10000);
});
