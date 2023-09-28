exports.isAuthenticated = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    next();
};

exports.isAdmin = async (req, res, next) => {
    await exports.isAuthenticated(req, res, async () => {
        const isAdmin = await req.user.isSuperuser;
        if (!isAdmin) {
            res.status(403).json({ error: "Not authorized" });
            return;
        }
        next();
    });
};
