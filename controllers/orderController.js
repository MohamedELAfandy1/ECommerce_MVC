const { validationResult } = require("express-validator");
const { getCartById, getCart } = require("../models/cartModel");
const { createOrder, getAllOrders } = require("../models/orderModel");
const { getProductById } = require("../models/productModel");

exports.setAddress = async (req, res, next) => {
  try {
    let validation = req.flash("validationErrors") || undefined;
    res.render("setAddress", {
      cartId: req.body.cartId,
      isUser: true,
      isAdmin: req.session.isAdmin || false,
      flag: req.body.flag,
      validation,
      pageTitle:"set Address-Page"
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

exports.getOrders = async (req, res, next) => {
  try {
    orders = await getAllOrders(req.session.userId);
    res.render("order", {
      orders,
      isUser: true,
      isAdmin: req.session.isAdmin || false,
      pageTitle:"Order-Page"
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

exports.makeOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      let cart = await getCartById(req.body.cartId);
      await createOrder({
        address: req.body.address,
        name: cart.name,
        productId: cart.productId,
        amount: cart.amount,
        price: cart.price * cart.amount,
        userId: cart.userId,
        cartId: cart._id,
      });
      res.redirect("/order");
    } else {
      req.flash("validationErrors", errors.array()); // Store errors in flash messages
      const validation = req.flash("validationErrors") || undefined;
      res.render("setAddress", {
        isAdmin: req.session.isAdmin || false,
        isUser: true,
        validation,
        flag: req.body.flag,
        cartId: req.body.cartId,
        pageTitle:"Set Address-Page"
      });
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

exports.makeAllOrders = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("validationErrors", errors.array()); // Store errors in flash messages
      const validation = req.flash("validationErrors") || undefined;
      res.render("setAddress", {
        isUser: true,
        isAdmin: req.session.isAdmin || false,
        validation,
        flag: req.body.flag,
        cartId: req.body.cartId,
        pageTitle:"Error-Page"
      });
    }

    // Retrieve carts
    let carts = await getCart(req.session.userId);
    let stockError = null;

    // Process each cart item
    for (let i = 0; i < carts.length; i++) {
      let product = await getProductById(carts[i].productId);
      if (product.amount >= carts[i].amount) {
        await createOrder({
          address: req.body.address,
          name: carts[i].name,
          productId: carts[i].productId,
          amount: carts[i].amount,
          price: carts[i].price * carts[i].amount,
          userId: carts[i].userId,
          cartId: carts[i]._id,
        });
      } else {
        stockError = `Not enough stock for ${carts[i].name}`;
        break;
      }
    }

    // If there was a stock error, redirect to the cart page with an error message
    if (stockError) {
      req.flash("stockError", stockError);
      return res.redirect("/cart");
    }

    // If no errors, redirect to the order confirmation page
    res.redirect("/order");
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
