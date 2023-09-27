const User = require("../models/User");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.get({ email: email });
  if (user) {
    res.status(400).json({ error: "email already exists" });
    return;
  }
  // random username
  const username = Math.random().toString(36).substring(2, 15);
  const newUser = await User.create({ username, email, password });
  const token = User.generateToken(newUser);
  res.json(token);
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.get({ username: username });
  const isAuth = await User.authenticate(username, password);
  if (!user || !isAuth) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  const token = User.generateToken(user);
  res.json(token);
};


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const token = await User.refreshToken(refreshToken);
  res.json(token);
};
exports.profile = async (req, res) => {
  const user = await User.get({ username: req.user.username }, { select: { username: true, email: true } });
  res.json(user);
}

