const User = require("../models/User");
const jwt = require("jsonwebtoken");

const NotLoggedIn = async (req, res, next) => {
  try {
    const {
      authorization
    } = req.headers;
    if (authorization == null)
      return res.status(401).send("please check authorization");
    const token = authorization.replace("Bearer ", "");

    const payload = jwt.decode(token, process.env.TOKEN_SECRET);
    if (payload == null) return res.status(401).send("token is required");
    const user = await User.findById(payload._id);
    // return console.log(user)
    if (!user) return res.status(401).send("user not found");
    req.id = payload.id;

    req.login_user = user;
    // return console.log(req.login_user);
  } catch (error) {
    console.log(error);
    return res.status(401).send("Something went wrong");
  }
  next();
};

module.exports = {
  NotLoggedIn,
};