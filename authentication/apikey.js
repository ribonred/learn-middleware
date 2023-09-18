const User = require("../models/User");
const BaseAuth = require("./base");

class ApiKeyAuth extends BaseAuth {
    async getUser(req) {
        const apikey = req.headers["x-api-key"];
        if (apikey === "1234") {
            const user = await User.get(
                { username: "testUser" },
                { select: { username: true, permissions: true } }
                );
            return user;
        }
        return null;
    }
}
module.exports = ApiKeyAuth;

