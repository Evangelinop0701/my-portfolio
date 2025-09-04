const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isLoggedIn = require('../middleware/auth');
// Show login form
router.get("/", isLoggedIn, (req, res) => {
  res.render("admin_page", { title: "Portfolio Evan" });
});

module.exports = router;
