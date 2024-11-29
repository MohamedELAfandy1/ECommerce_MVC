const mongoose = require("mongoose");

const DB_URL = "mongodb://localhost:27017/ecommerce";

cartSchema = mongoose.Schema({
  name: String,
  price: Number,
  amount: Number,
  userId: String,
  productId: String,
  timestamp: Number,
});

const cartModel = mongoose.model("cart", cartSchema);

exports.addNewItem = async (data) => {
  try {
    await mongoose.connect(DB_URL);
    let cart = await cartModel.findOne({
      userId: data.userId,
      productId: data.productId,
    });
    if (cart) {
      cart.amount = +cart.amount + +data.amount;
      cart.timestamp = data.timestamp;
      await cart.save();
      return cart;
    } else {
      let item = new cartModel(data);
      await item.save();
      return item;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};

exports.getCart = async (id) => {
  try {
    await mongoose.connect(DB_URL);

    let cart = await cartModel.find(
      { userId: id }, // Query: Find carts with a specific userId
      {}, // Projection: Empty, meaning all fields are returned
      { sort: { timestamp: 1 } } // Options: Sort by timestamp in ascending order
    );
    return cart;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};
exports.getCartById = async (id) => {
  try {
    await mongoose.connect(DB_URL);

    let cart = await cartModel.findById(id);
    return cart;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};

exports.editItem = async (id, newData) => {
  try {
    await mongoose.connect(DB_URL);
    let newItem = await cartModel.updateOne({ _id: id }, newData);
    return newItem;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};
exports.deleteItem = async (id) => {
  try {
    await mongoose.connect(DB_URL);
    return await cartModel.deleteOne({ _id: id });
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};
exports.deleteAll = async (id) => {
  try {
    await mongoose.connect(DB_URL);
    return await cartModel.deleteMany({ userId: id });
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};
