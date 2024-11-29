const express = require("express");
const { isAdmin } = require("./gaurds/adminGaurd");
const {
  getAdd,
  postAdd,
  getManageOrders,
  updateOrderStatus,
} = require("../controllers/adminController");
const check = require("express-validator").check;
const multer = require("multer");
const router = express.Router();

router.get("/add", isAdmin, getAdd);
router.post(
  "/add",
  isAdmin,
  multer(
    // { dest: "images" }
    {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "images");
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
        },
      }),
    }
  ).single("image"), //return middleware    and create req.file

  check("name").notEmpty().withMessage("Name Is Required"),
  check("amount").notEmpty().withMessage("Amount Is Required"),
  check("price").notEmpty().withMessage("Price Is Required"),
  check("description").notEmpty().withMessage("Description Is Required"),
  check("category").notEmpty().withMessage("Category Is Required"),
  check("image").custom((val, { req }) => {
    if (req.file) return true;
    else throw "image is required";
  }),
  postAdd
);
router.get("/manageOrders", isAdmin, getManageOrders);
router.post("/updateStatus", isAdmin, updateOrderStatus);
module.exports = router;
