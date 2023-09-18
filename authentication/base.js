class BaseAuth {
    async getUser(req) {
        return null;
    }
    async authenticate(req, res, next) {
        if (!req.user) {
            const user = await this.getUser(req);
            if (user) {
                req.user = user;
            }
        }
    }
}
module.exports = BaseAuth;

