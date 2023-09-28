const User = require("../models/User");
const BaseAuth = require("./base");

class JwtAuth extends BaseAuth {

  async getUser(req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const _user = await User.parseTokenSafe(token);
      const user = this.exclude(_user, ["password"]);
      return user;
    }
    return null;
  }
}
module.exports = JwtAuth;

