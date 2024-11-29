const { validationResult } = require("express-validator");
const {
  addNewItem,
  getCart,
  editItem,
  deleteItem,
  deleteAll,
} = require("../models/cartModel");
const { isAdmin } = require("../routes/gaurds/adminGaurd");

exports.postCart = async (req, res, next) => {
  try {
    if (validationResult(req).isEmpty()) {
      await addNewItem({
        name: req.body.productName,
        amount: req.body.amount,
        price: req.body.productPrice,
        productId: req.body.productId,
        userId: req.session.userId,
        timestamp: Date.now(),
      });
      res.redirect("/cart");
    } else {
      req.flash("validationErrors", validationResult(req).array());
      res.redirect(req.body.redirectTo || "/");
    }
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

exports.getCart = async (req, res, next) => {
  try {
    let cart = await getCart(req.session.userId);

    res.render("cart", {
      cart,
      isUser: true,
      isAdmin: req.session.isAdmin || false,
      validationError: req.flash("validationErrors")[0] || undefined,
      stockError: req.flash("stockError")[0] || undefined,
      pageTitle:"Cart-Page"
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

exports.postSave = async (req, res, next) => {
  try {
    if (validationResult(req).isEmpty()) {
      await editItem(req.body.cartId, {
        amount: req.body.amount,
        timestamp: Date.now(),
      });
      res.redirect("/cart");
    } else {
      req.flash("validationErrors", validationResult(req).array());
      res.redirect(req.body.redirectTo || "/cart");
    }
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

exports.postDelete = async (req, res, next) => {
  try {
    await deleteItem(req.body.cartId);
    res.redirect("/cart");
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

exports.postDeleteAll = async (req, res, next) => {
  try {
    await deleteAll(req.session.userId);
    res.redirect("/cart");
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
