// middleware/auth.js
function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/auth');
  }
}

module.exports = isLoggedIn;
