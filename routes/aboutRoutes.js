const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../api/data/skills.json");

  // Read JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send("Error loading skills");
    }

    const skills = JSON.parse(data); // convert to JS array/object

    // Pass data to EJS template
    res.render("module/about/about", { title: "About Me", skills });
  });
});

module.exports = router;
