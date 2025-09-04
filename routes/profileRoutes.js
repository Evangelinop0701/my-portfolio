const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isLoggedIn = require('../middleware/auth');


router.get('/', isLoggedIn, (req, res) => {
  const userId = req.session.userId;
  req.db.query('SELECT * FROM profiles WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile: ' + err.stack);
      return res.status(500).send('Error fetching user profile');
    }
    if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.render('module/profiles/view', { title: 'Profile', data: results[0] });
    });
});

module.exports = router;