const jwt = require("jsonwebtoken");
const userdb = require("../models/userSchema");
const secretKey = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verifyToken = jwt.verify(token, secretKey);
    const rootUser = await userdb.findOne({ _id: verifyToken._id });

    if (!rootUser) {
      throw new Error("User Not Found");
    } else {
      req.token = token;
      req.rootUser = rootUser;
      req.userId = rootUser._id;
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ status: 401, message: "Unauthorized User, no token provided" });
  }
};

module.exports = authenticate;
