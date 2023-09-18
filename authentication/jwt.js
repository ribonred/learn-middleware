const User = require("../models/User");
const BaseAuth = require("./base"); 

class JwtAuth extends BaseAuth {
  async getUser(req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const user = await User.parseTokenSafe(token, { select: { username: true, permissions: true } });
      return user;
    }
    return null;
  }
}
module.exports = JwtAuth;

