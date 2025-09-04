const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isLoggedIn = require('../middleware/auth');

router.get('/', isLoggedIn, (req, res) => {
  const userId = req.session.userId;        
    req.db.query('SELECT * FROM skills WHERE user_id = ?', [userId], (err, results) => {    
        if (err) {
            console.error('Error fetching skills: ' + err.stack);
            return res.status(500).send('Error fetching skills');
        }
        res.render('module/skills/skill', { title: 'Skills', data: results });
    });
});

module.exports = router;