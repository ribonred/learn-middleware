const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


describe("User model", () => {
  require('../fixtures/users.js');
  test("create method hashes password", async () => {
    const user = await User.get({ username: "testUser" });
    const hashedPassword = CryptoJS.PBKDF2("testPassword", process.env.SECRET, { keySize: 256 / 32, iterations: 1000 }).toString();
    expect(user.password).toBe(hashedPassword);
  });
  test("get method returns a user by id", async () => {
    const user = await User.get({ username: "testUser" });
    const foundUser = await User.get({ id: user.id });
    expect(foundUser.id).toBe(user.id);
  });
  test("get method returns a user by username", async () => {
    const user = await User.get({ username: "testUser" });
    const foundUser = await User.get({ username: user.username });
    expect(foundUser.username).toBe(user.username);
  });
  test("authenticate method returns true for correct password", async () => {
    const user = await User.get({ username: "testUser" });
    const isAuthenticated = await User.authenticate(user.username, "testPassword");
    expect(isAuthenticated).toBe(true);
  });
  test("authenticate method returns false for incorrect password", async () => {
    const user = await User.get({ username: "testUser" });
    const isAuthenticated = await User.authenticate(user.username, "wrongpassword");
    expect(isAuthenticated).toBe(false);
  });
  test("generateToken method returns a valid JWT", async () => {
    const user = await User.get({ username: "testUser" });
    const token = User.generateToken(user);
    const decoded = jwt.verify(token, process.env.SECRET);
    expect(decoded.id).toBe(user.id);
  });
  test("parseToken method returns a user for a valid token", async () => {
    const user = await User.get({ username: "testUser" });
    const token = User.generateToken(user);
    const parsedUser = await User.parseToken(token);
    expect(parsedUser.id).toBe(user.id);
  });
  test("parseTokenSafe method returns a user for a valid token", async () => {
    const user = await User.get({ username: "testUser" });
    const token = User.generateToken(user);
    const parsedUser = await User.parseTokenSafe(token);
    expect(parsedUser.id).toBe(user.id);
  });
  test("parseTokenSafe method returns null for an invalid token", async () => {
    const parsedUser = await User.parseTokenSafe("invalidtoken");
    expect(parsedUser).toBeNull();
  });
});

