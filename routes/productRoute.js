const express = require("express");
const { getProduct } = require("../controllers/productController");
const { getHome } = require("../controllers/homeController");
const { deleteProduct } = require("../controllers/adminController");

const router = express.Router();

router.get("/", getHome);
router.get("/:id", getProduct);
router.post("/delete/:productId", deleteProduct);

module.exports = router;
