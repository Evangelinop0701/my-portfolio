const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");                // MySQL connection
const userRoutes = require("./routes/routesUsers"); // User routes
const authRoutes = require("./routes/authRoutes"); // User routes
const adminRoutes = require("./routes/admiRoutes"); // Admin routes
const profileRoutes = require("./routes/profileRoutes"); // Admin routes
const routeSkill = require("./routes/routeSkill"); // Admin routes
const session = require('express-session');

const app = express();
const PORT = 3000;


app.use(session({
  secret: 'mysecretkey123', // change to a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
// Middleware
app.use(express.static("public"));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submissions

// Attach db connection to req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Set template engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);
app.use("/skills", routeSkill);

// Home page
app.get("/", (req, res) => {
  req.db.query("SELECT * FROM profiles LIMIT 1", (err, results) => {
    if (err) {
      console.error("Error fetching profiles: " + err.stack);
      return res.status(500).send("Error fetching profiles");
    }
    const name = results.length > 0 ? results[0].full_name : "Guest";
    const title = results.length > 0 ? results[0].title : "Unknown";
    const bio = results.length > 0 ? results[0].bio : "No bio available";
    const context = {
      title: "Portfolio Evan",
      data: results,
      name: name,
      title_bio: title,
      bio: bio
    };
    res.render("index", context);
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
