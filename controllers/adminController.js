const { validationResult } = require("express-validator");
const { createProduct, deleteProduct } = require("../models/productModel");
const { isAdmin } = require("../routes/gaurds/adminGaurd");
const {
  getAllOrdersAdmin,
  updateOrderStatus,
} = require("../models/orderModel");
const { getUserByID, getAllUsers } = require("../models/userModel");

exports.getAdd = (req, res, next) => {
  res.render("addProduct", {
    isUser: true,
    isAdmin: true,
    validation: req.flash("validationErrors"),
    pageTitle: "Add Product-Page",
  });
};

exports.postAdd = async (req, res, next) => {
  try {
    console.log(req.file);
    if (validationResult(req).isEmpty()) {
      req.body.image = req.file.filename;
      await createProduct(req.body);
      res.redirect("/");
    } else {
      req.flash("validationErrors", validationResult(req).array());
      res.render("addProduct", {
        isUser: true,
        isAdmin: true,
        validation: req.flash("validationErrors"),
        pageTitle: "Add Product-Page",
      });
    }
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle: "Error-Page",
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    await deleteProduct(req.params.productId);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle: "Error-Page",
    });
  }
};

exports.getManageOrders = async (req, res, next) => {
  try {
    let orders = [];
    filteredObject = req.query.status;
    if (req.query.email) {
      let user = await getAllUsers({ email: req.query.email });
      console.log(user[0]._id);
      orders = await getAllOrdersAdmin({ userId: user[0]._id });
    } else if (req.query.status) {
      orders = await getAllOrdersAdmin({ status: req.query.status });
    } else {
      orders = await getAllOrdersAdmin();
    }

    const emails = [];

    for (const order of orders) {
      let id = order.userId;
      let user = await getUserByID(id);
      emails.push(user.email);
    }
    res.render("manageOrders", {
      orders,
      isUser: true,
      isAdmin: req.session.isAdmin || false,
      pageTitle: "Manage Orders-Page",
      emails,
    });
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle: "Error-Page",
    });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    orders = await updateOrderStatus(req.body.orderId, req.body.status);
    res.redirect("/admin/manageOrders");
  } catch (err) {
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
      pageTitle: "Error-Page",
    });
  }
};
