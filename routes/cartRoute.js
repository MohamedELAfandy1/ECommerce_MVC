const express = require("express");
const { postCart, getCart, postSave,postDelete ,postDeleteAll} = require("../controllers/cartController");
const { isAuth } = require("./gaurds/authGaurd");
const { check } = require("express-validator");
const router = express.Router();

router.post(
  "/",
  isAuth,
  check("amount")
    .notEmpty()
    .withMessage("Amount Is Required")
    .isInt({ min: 1 })
    .withMessage("Amount Must Be Greater Than 0"),
  postCart
);

router.get("/", isAuth, getCart);
router.post("/save",   isAuth,
  check("amount")
    .notEmpty()
    .withMessage("Amount Is Required")
    .isInt({ min: 1 })
    .withMessage("Amount Must Be Greater Than 0"),
  postSave
 )
router.post("/delete",   isAuth,
  postDelete
 )
router.post("/deleteAll",   isAuth,
  postDeleteAll
 )
module.exports = router;
