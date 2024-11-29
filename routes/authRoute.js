const express = require("express");
const {
  signUp,
  getSignUpPage,
  getLoginPage,
  login,
  logout,
} = require("../controllers/authController");
const { notAuth, isAuth } = require("./gaurds/authGaurd");
const check = require("express-validator").check;
const validationResult = require("express-validator").validationResult;

const router = express.Router();

router.get("/signUp", notAuth, getSignUpPage);
router.post(
  "/signUp",
  check("name").notEmpty().withMessage("Name Is Required"),
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Not A Valid Email"),
  check("password").isLength({ min: 6 }).withMessage("Too Short Password"),
  check("passwordConfirm")
    .custom((value, { req }) => {
      if (value == req.body.password) {
        return true;
      } else {
        throw "Incorrect Password Confirm";
      }
    })
    .withMessage("Incorrect Password Confirm"),
  signUp
);

router.get("/login", notAuth, getLoginPage);
router.post(
  "/login",
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email"),
  check("password").isLength({ min: 6 }).withMessage("Too Short Password"),
  login
);

router.all("/logout", isAuth, logout);

module.exports = router;
