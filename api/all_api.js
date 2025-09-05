const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/skills", (req, res) => {
    const userId = req.session.userId;

    // First query: categories
    req.db.query("SELECT ktg FROM skills WHERE user_id = ? GROUP BY ktg", [userId], (err, categories) => {
        if (err) {
            console.error("Error fetching categories: " + err.stack);
            return res.status(500).json({
                error: "Error fetching categories"
            });
        }
        // First query: categories
        req.db.query("SELECT * FROM profiles WHERE user_id = ?", [userId], (err, user) => {
            if (err) {
                console.error("Error fetching user: " + err.stack);
                return res.status(500).json({
                    error: "Error fetching user"
                });
            }

            const username = user.length > 0 ? user[0].full_name : "Guest";

            // Second query: all skills
            req.db.query("SELECT skill_name,icon,durasaun FROM skills WHERE user_id = ?", [userId], (err, skills) => {
                if (err) {
                    console.error("Error fetching skills: " + err.stack);
                    return res.status(500).json({
                        error: "Error fetching skills"
                    });
                }
                const profiles = {
                    name: user.length > 0 ? user[0].full_name : "Guest",
                }
                const response = {
                    categories,
                    skills,
                    profiles
                };

                // Save response to file
                const filePath = path.join(__dirname, "../api/data/skills.json");
                fs.writeFile(filePath, JSON.stringify(response, null, 2), (err) => {
                    if (err) {
                        console.error("Error writing JSON file: " + err.stack);
                    }
                });

                // Send one response only
                res.json(response);
            });
        });
    });
});


module.exports = router;