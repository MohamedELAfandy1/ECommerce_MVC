const express = require("express");
const {
  setAddress,
  getOrders,
  makeOrder,
  makeAllOrders,
} = require("../controllers/orderController");
const { check } = require("express-validator");
const { getCartById } = require("../models/cartModel");
const { getProductById } = require("../models/productModel");
const router = express.Router();

router.get("/", getOrders);
router.post("/", setAddress);
router.post("/orderAll", setAddress);
router.post(
  "/makeOrder",
  check("address")
    .notEmpty()
    .withMessage("Address Is Required")
    .isString()
    .withMessage("Enter Valid Address"),
  check("cartId")
    .custom(async (val, { req }) => {
      let cart = await getCartById(val);
      let product = await getProductById(cart.productId);
      if (product.amount < cart.amount) {
        throw new error(`Only ${product.amount} Of ${cart.name} In Stock`);
      }
    })
    .withMessage(`Not Avalible Enough Amount In Stock `),
  makeOrder
);
router.post(
  "/makeAllOrders",
  check("address")
    .notEmpty()
    .withMessage("Address Is Required")
    .isString("Enter Valid Address"),
  makeAllOrders
);

module.exports = router;
