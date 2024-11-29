const { validationResult } = require("express-validator");
const { signUp, login } = require("../models/userModel");
const { isAdmin } = require("../routes/gaurds/adminGaurd");

exports.signUp = async (req, res, next) => {
  try {
    if (validationResult(req).isEmpty()) {
      await signUp(req.body);
      res.redirect("/login");
    } else {
      req.flash("validationErrors", validationResult(req).array());
      res.redirect("/signUp");
    }
  } catch (err) {
    req.flash("authError", err.message);
    res.redirect("/signUp");
  }
};

exports.getSignUpPage = async (req, res, next) => {
  try {
    const authError = req.flash("authError")[0] || null;
    const validation = req.flash("validationErrors") || null;

    res.render("signUp", {
      authError,
      validation,
      isUser: req.session.userId,
      isAdmin: false,
      pageTitle:"Register-Page"
    });
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle:"Error-Page"
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    if (validationResult(req).isEmpty()) {
      let user = await login(req.body);
      req.session.userId = user._id;
      req.session.isAdmin = user.isAdmin;
      res.redirect("/");
    } else {
      req.flash("validationErrors", validationResult(req).array());
      res.redirect("/login");
    }
  } catch (err) {
    req.flash("authError", err.message);
    res.redirect("/login");
  }
};

exports.getLoginPage = async (req, res, next) => {
  try {
    const authError = req.flash("authError")[0] || null;
    const validation = req.flash("validationErrors") || null;
    console.log("VALID", validation);
    res.render("login", {
      authError,
      validation,
      isUser: req.session.userId,
      isAdmin: false,
      pageTitle:"Login-Page"
    });
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle:"Error-Page"
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle:"Error-Page"
    });
  }
};
