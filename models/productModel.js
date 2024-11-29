const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/ecommerce";

productSchema = mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  category: String,
  amount: Number,
});

const productModel = mongoose.model("product", productSchema);

exports.getAllProducts = async (filterObject = {}) => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
    let products = await productModel.find(filterObject);
    return products;
  } catch (err) {
    console.error("Error fetching products:", err);
    return []; // Fallback: return an empty array on error
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
};
exports.getProductById = async (id) => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");
    let product = await productModel.findById(id);
    return product;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
};

exports.createProduct = async (payload) => {
  try {
    await mongoose.connect(DB_URL);
    let product = await productModel.create(payload);
    return product;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
};

exports.deleteProduct = async (id) => {
  try {
    await mongoose.connect(DB_URL);
    return await productModel.deleteOne({ _id: id });
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
};
