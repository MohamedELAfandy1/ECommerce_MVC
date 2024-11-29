const { getAllProducts } = require("../models/productModel");
const { isAdmin } = require("../routes/gaurds/adminGaurd");

exports.getHome = async (req, res, next) => {
  try {
    let products = await getAllProducts();
    let validCategories = ["clothes", "phones", "computers"];

    if (req.query.category && validCategories.includes(req.query.category)) {
      let filteredProducts = await getAllProducts({
        category: req.query.category,
      });

      // if (req.query.category === "clothes") {
      //   throw new Error("eee");
      // }

      res.render("index", {
        products: filteredProducts,
        isUser: req.session.userId || false,
        isAdmin: req.session.isAdmin || false,
        validationError: req.flash("validationErrors")[0] || undefined,
        pageTitle:"Home-Page"
      });
    } else {
      res.render("index", {
        products,
        isUser: req.session.userId || false,
        isAdmin: req.session.isAdmin || false,
        validationError: req.flash("validationErrors")[0] || undefined,
        pageTitle:"Home-Page"
      });
    }
  } catch (err) {
    //! Custom Error Handeling
    // console.log(err);
    // res.render("error", {
    //   isUser: req.session.userId,
    //   isAdmin: req.session.isAdmin,
    //   err: err.message || "Something went wrong",
    // pageTitle:"Error-Page"
    // });

    // res.redirect("/error");  //! For First Way Of Error Handeling
    
    // next(err);               //! For Second Way Of Error Handeling
  }
};
