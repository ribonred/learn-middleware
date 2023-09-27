const { PrismaClient } = require("@prisma/client");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();


class User {
  static make_password(password) {
    return CryptoJS.PBKDF2(password, process.env.SECRET, { keySize: 256 / 32, iterations: 1000 }).toString();
  }
  static async create({ username, email, password }) {
    return await prisma.user.create({ data: { username, email, password: this.make_password(password) } });
  }
  static async get(fieldValuePair, options) {
    return await prisma.user.findUnique({ where: fieldValuePair, ...options });
  }
  static async authenticate(username, rawPassword) {
    const user = await this.get({ username });
    if (!user) return false;
    const hashedPassword = CryptoJS.PBKDF2(rawPassword, process.env.SECRET, { keySize: 256 / 32, iterations: 1000 }).toString();
    return user.password === hashedPassword;
  }
  static generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "1h" });
  }
  static async parseToken(token, options) {
    const { id } = jwt.verify(token, process.env.SECRET);
    return await this.get({ id }, options);
  }
  static async parseTokenSafe(token, options) {
    try {
      return await this.parseToken(token, options);
    } catch (error) {
      return null;
    }
  }
  static async delete(id) {
    return await prisma.user.delete({ where: { id } });
  }
}
module.exports = User;
