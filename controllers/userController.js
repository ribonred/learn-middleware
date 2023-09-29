const User = require("../models/User");
const cache = require('memory-cache');
const prisma = require("../models/extensions").prisma;

const sendEmail = (email, token) => {
  console.log(`Subject: Password reset request`);
  console.log(`To: ${email}`);
  console.log(`Body: http://localhost:3000/user/reset?token=${token}`);

};
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
  const { email, password } = req.body;
  const user = await User.get({ email: email });
  const isAuth = await User.authenticate(user.username, password);
  if (!user || !isAuth) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  const token = User.generateToken(user);
  res.json(token);
};

exports.login_session = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.get({ email: email });
  const isAuth = await User.authenticate(user.username, password);
  if (!user || !isAuth) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  const { accesToken, expireAt, refreshToken } = User.generateToken(user);
  res.cookie('accesToken', accesToken, { httpOnly: true, expire: expireAt });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, expire: expireAt });
  res.json();
};

exports.logout_session = async (req, res) => {
  res.clearCookie('accesToken');
  res.clearCookie('refreshToken');
  res.json();
};
exports.passwordResetRequest = async (req, res) => {
  const { email } = req.body;
  const user = await User.get({ email: email });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const key = Math.random().toString(36).substring(2, 15);
  // set cache 5 minutes
  cache.put(key, user.email, 5 * 60 * 1000);
  sendEmail(user.email, key);
  res.json({ message: "Password reset email sent" });
};

exports.passwordReset = async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;
  const email = cache.get(token);
  console.log(token);
  console.log(cache.keys());
  if (!email) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const user = await User.get({ email: email });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await prisma.user.update({
    where: {
      username: user.username
    },
    data: {
      password: User.make_password(password)
    }
  });
  cache.del(token);
  res.json({ message: "Password reset success" });
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
exports.adminProfile = async (req, res) => {
  const user = await User.get({ username: req.user.username }, { select: { username: true, email: true } });
  res.json(user);
}

