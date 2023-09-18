const User = require("../models/User");
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.get({ username: username });
  const isAuth = await User.authenticate(username, password);
  if (!user || !isAuth) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  const token = User.generateToken(user);
  res.json({ token });
};
exports.profile = async (req, res) => {
  const user = await User.get({ username: req.user.username }, { select: { username: true, email: true } });
  res.json(user);
}

