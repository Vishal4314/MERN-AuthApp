const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("not valid email");
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  resetPassToken: {
    type: String,
  },
});

//hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
  }
  next();
});

//generate and save token
userSchema.methods.generateAuthToken = async function () {
  try {
    let newCreatedToken = jwt.sign({ _id: this._id }, secretKey, {
      expiresIn: "1d",
    });
    this.tokens = this.tokens.concat({ token: newCreatedToken });
    this.save();
    return newCreatedToken;
  } catch (error) {
    res.status(422).json(error);
    console.log("error while creating Token", error);
  }
};

const userdb = new mongoose.model("users", userSchema);

module.exports = userdb;
