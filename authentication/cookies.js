const User = require("../models/User");
const BaseAuth = require("./base");

class JwtCookiesAuth extends BaseAuth {

  async getUser(req) {
    const token = req.cookies?.accesToken;
    if (token) {
      const _user = await User.parseTokenSafe(token);
      const user = this.exclude(_user, ["password"]);
      return user;
    }
    return null;
  }
}
module.exports = JwtCookiesAuth;

