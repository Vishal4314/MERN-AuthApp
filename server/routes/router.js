const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const userdb = require("../models/userSchema");
const authenticate = require("../middleware/authenticate");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const secretKey = "abcdefghijklmnopqrstuvwxyzvishal";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    res.status(422).json({ error: "Fill all the details." });
  } else if (password !== confirmPassword) {
    res.status(422).json({ error: "passowrd and confirm password not match." });
  } else {
    const preUser = await userdb.findOne({ email: email });
    if (preUser) {
      res.status(422).json({ error: "E-Mail already exists" });
    } else {
      try {
        const finalUser = new userdb({
          name,
          email,
          password,
          confirmPassword,
        });
        console.log("*********************");

        const storedData = await finalUser.save();
        // console.log("the stored data in db is", storedData);
        res.status(201).json({
          message: "user stored in db",
          data: storedData,
          status: 201,
        });
      } catch (error) {
        res
          .status(422)
          .json({ message: "error while saving data", error: error });
        console.log("error while saving data in db", error);
      }
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Fill all the Details" });
  } else {
    try {
      const validUser = await userdb.findOne({ email: email });
      if (validUser) {
        const isMatch = await bcrypt.compare(password, validUser.password);
        if (!isMatch) {
          res.status(422).json({ error: "Password Incorrect" });
        } else {
          //generating token
          const token = await validUser.generateAuthToken();
          //generating cookie
          res.cookie("userCookie", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
          });
          //send the response from backend
          const result = { validUser, token };
          res.status(201).json({ status: 201, data: result });
        }
      } else {
        res.status(422).json({ message: "Email does not exist, Sign Up" });
      }
    } catch (error) {
      console.log("error whle validating user", error);
      res.status(422).json({ message: "error validating user", error });
    }
  }
});

router.get("/validUser", authenticate, async (req, res) => {
  try {
    const validUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, validUserOne });
  } catch (error) {
    console.log("error whle validating user", error);
    res.status(401).json({ status: 401, error });
  }
});

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((currTok) => {
      return currTok.token !== req.token;
    });

    res.clearCookie("userCookie", { path: "/" });
    await req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

router.post("/sendpasswordlink", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  } else {
    try {
      const validUser = await userdb.findOne({ email: email });
      console.log("$$$$$user is", validUser);
      if (!validUser) {
        res
          .status(401)
          .json({ status: 401, message: "Email not registered with us" });
      } else {
        //token generate for resetting password
        const newToken = jwt.sign({ _id: validUser._id }, secretKey, {
          expiresIn: "120s",
        });
        console.log("the token generated is", newToken);
        const updateUserVerifyToken = await userdb.findByIdAndUpdate(
          { _id: validUser._id },
          { resetPassToken: newToken },
          { new: true }
        );
        console.log(
          ("the resetpasstoke is stored and user is", updateUserVerifyToken)
        );
        if (updateUserVerifyToken) {
          const mailOptions = {
            from: "vishalmishra9351@gmail.com",
            to: email,
            subject: "Link for Restting the Password.",
            text: `The Link to Reset Password is valid for 2 MINUTES http://localhost:3000//forgotpassword/${validUser._id}/${updateUserVerifyToken.resetPassToken}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error while sending Mail from nodemailer", error);
              res.status(401).json({
                status: 401,
                message: "Error while sending Mail from nodemailer",
                error: error,
              });
            } else {
              console.log(
                "Email sent Successfully from nodemailer",
                info.response
              );
              res.status(201).json({
                status: 201,
                message: "Email Sent from node mailer successfully",
                info: info.response,
              });
            }
          });
        }
      }
    } catch (error) {
      console.log("Error whle resetting password", error);
      res.status(401).json({
        status: 401,
        message: "Error while resetting password",
        error: error,
      });
    }
  }
});

module.exports = router;

//encrypt, decrypt ---> 2 way password securing method ----> security concerns arose
// 12345 ---> e@*%#yhG)          ENCRYPT
// e@*%#yhG) ---> 12345          DECRYPT

//HASHING---> one way ---> more secure---> in hashing we compare
// 12345 ---> e@*%#yhG)     hashing
// 1234 ---> e@*%#yio)      hashing again
// compare(e@*%#yhG) , e@*%#yio) ) ---> false
// 12345 ---> e@*%#yhG)      hashing again
// compare(e@*%#yhG) , e@*%#yhG)) ---> true

//to send an email to user ----> in case of forgot password
//we install nodemailer
