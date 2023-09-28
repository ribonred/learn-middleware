const User = require("../models/User");
const BaseAuth = require("./base");

class ApiKeyAuth extends BaseAuth {
    async getUser(req) {
        const apikey = req.headers["x-api-key"];
        if (apikey === "1234") {
            const _user = await User.get(
                { username: "testUser" },
            );
            const user = this.exclude(_user, ["password"]);
            return user;
        }
        return null;
    }
}
module.exports = ApiKeyAuth;

