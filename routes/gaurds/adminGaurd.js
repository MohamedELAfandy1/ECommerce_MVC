exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) next();
  else {
    res.status(403);
    res.render("error", {
      isUser: req.session.isUser,
      isAdmin: req.session.isAdmin,
      err: "You Are Not Allowed To Access This Route",
      pageTitle:"Error-Page"
    });
  }
};
