const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionStore = require("connect-mongodb-session")(session);
const falsh = require("connect-flash");

const app = express();

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(falsh());

app.use(bodyParser.urlencoded({ extended: true }));
const myStore = new sessionStore({
  uri: "mongodb://localhost:27017/ecommerce",
  collection: "sessions",
});

app.use(
  session({
    secret: "Any Secret String To Hash Express Sessions",
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 60 * 60 * 1000,
      // expires:new Date()
    },
    store: myStore,
  })
);
app.set("view engine", "ejs");
  app.set("views", "views");

const homeRouter = require("./routes/homeRoutes");
const productRouter = require("./routes/productRoute");
const authRouter = require("./routes/authRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const adminRouter = require("./routes/adminRoute");

app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);

//! First Way For Error Handeling   /*  res.redirect("/error") */
// app.use("/error", (req, res, next) => {
// res.status(500);
//   res.render("error", {
//     isUser: req.session.userId,
//     isAdmin: req.session.isAdmin,
//     err: "Something Went Wrong",
//   });
// });

//! Second Way For Error Handeling    /*  next(err) */
app.use((err, req, res, next) => {
  res.render("error", {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
    err: err.message || "Something Went Wrong",
    pageTitle: "Error",
  }); 
});

app.use((req, res, next) => {
  res.status(404);
  res.render("404Page", {
    isUser: req.session.userId,
    pageTitle: "Page Not Found",
    isAdmin: req.session.isAdmin,
  });
});

app.listen(4000, () => {
  console.log("Listenning On Port 4000");
});
