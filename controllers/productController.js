const { getProductById } = require("../models/productModel");
const { isAuth } = require("../routes/gaurds/authGaurd");

exports.getProduct = async (req, res, next) => {
  try{
    let id = req.params.id;
    let product = await getProductById(id);
    res.render("product", {
      product,
      isUser: req.session.userId || false,
      isAdmin: req.session.isAdmin || false,
      validationError: req.flash("validationErrors")[0] || undefined,
      pageTitle:"Product-Page"
    });
  
  }catch(err){
    console.log(err);
    res.render("error", {
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
      err: err.message || "Something went wrong",
    });
  }
};
