const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Show login form
router.get('/', (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// Handle login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) return res.status(400).send('All fields required');

  // Check if user exists
  req.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Incorrect password');

    // ✅ Login successful
    // For now, just redirect to /users
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    res.redirect('/admin');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/');
  });
})

module.exports = router;
