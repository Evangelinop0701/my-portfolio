const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
    res.render("about_my", {
        title: "About Me"
    });
});

module.exports = router;