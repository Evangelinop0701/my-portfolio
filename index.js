const express = require('express');
const path = require("path");
const fs = require("fs");
const aboutRoutes = require("./routes/aboutRoutes"); // API routes
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use("/about", aboutRoutes);

app.get("/", (req, res) => {
  const context = {
    title: "Portfolio Evan",
  };
  res.render("index_api", context);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});