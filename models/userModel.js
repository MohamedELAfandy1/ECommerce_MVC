const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DB_URL = "mongodb://localhost:27017/ecommerce";

userSchema = mongoose.Schema({
  name: String,
  image: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model("user", userSchema);

exports.signUp = async (userPayload) => {
  try {
    await mongoose.connect(DB_URL);

    if (userPayload.password !== userPayload.passwordConfirm) {
      throw new Error("Passwords do not match.");
    }

    if (await userModel.findOne({ email: userPayload.email })) {
      throw new Error("Email is already registered.");
    }

    userPayload.password = await bcrypt.hash(userPayload.password, 12);
    const user = await userModel.create(userPayload);
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await mongoose.disconnect(DB_URL);
  }
};

exports.login = async (userPayload) => {
  try {
    await mongoose.connect(DB_URL);
    let user = await userModel.findOne({ email: userPayload.email });
    if (user && (await bcrypt.compare(userPayload.password, user.password))) {
      return user;
    } else {
      throw new Error("Email Or Password is Wrong");
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await mongoose.disconnect(DB_URL);
  }
};
exports.getUserByID = async (id) => {
  try {
    await mongoose.connect(DB_URL);
    let user = await userModel.findById(id);
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await mongoose.disconnect(DB_URL);
  }
};
exports.getAllUsers = async (filteredObject) => {
  try {
    await mongoose.connect(DB_URL);

    let users;
    if (!filteredObject) {
      users = await userModel.find();
    } else {
      users = await userModel.find(filteredObject);
    }
    return users;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await mongoose.disconnect(DB_URL);
  }
};
