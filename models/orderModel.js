const mongoose = require("mongoose");
const { deleteItem } = require("./cartModel");

const DB_URL = "mongodb://localhost:27017/ecommerce";

orderSchema = mongoose.Schema({
  name: String,
  price: Number,
  amount: Number,
  userId: String,
  productId: String,
  timestamp: Number,
  cartId: String,
  address: String,
  status: String,
});

const orderModel = mongoose.model("order", orderSchema);

exports.createOrder = async (data) => {
  try {
    await mongoose.connect(DB_URL);
    let order = new orderModel({
      ...data,
      timestamp: Date.now(),
      status: "pending",
    });
    await order.save();
    console.log(data);
    await deleteItem(data.cartId);
    return order;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};

exports.getAllOrders = async (id) => {
  try {
    await mongoose.connect(DB_URL);
    let orders = await orderModel.find(
      { userId: id },
      {},
      { sort: { timestamp: -1 } }
    );
    return orders;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};

exports.getAllOrdersAdmin = async (filterObject) => {
  try {
    await mongoose.connect(DB_URL);
    let orders;
    if (!filterObject) {
      orders = await orderModel.find({}, {}, { sort: { timestamp: -1 } });
    } else {
      orders = await orderModel.find(
        filterObject,
        {},
        { sort: { timestamp: -1 } }
      );
    }
    return orders;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};

exports.updateOrderStatus = async (id, payload) => {
  try {
    await mongoose.connect(DB_URL);
    let order = await orderModel.findByIdAndUpdate(
      id,
      { status: payload },
      { new: true }
    );
    return order;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  } finally {
    await mongoose.disconnect();
  }
};
