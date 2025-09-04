const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const isLoggedIn = require('../middleware/auth');

// Read all users
router.get('/', isLoggedIn, (req, res) => {
  req.db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users: ' + err.stack);
      return res.status(500).send('Error fetching users');
    }

    const context = {
      title: 'User Management',
      data: results
    };

    res.render('module/users/users', context);
  });
});

// Show Add User form
router.get('/form', isLoggedIn, (req, res) => {
  res.render('module/users/form', { title: 'Add User' });
});


router.post('/add', isLoggedIn, async (req, res) => {
  const { username, email, password, full_name, bio } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  if (password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters long');
  }

  // Check if email exists
  req.db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error checking email: ' + err.stack);
      return res.status(500).send('Error checking email');
    }

    if (results.length > 0) {
      return res.status(400).send('Email already registered');
    }

    try {
      // 🔑 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user with hashed password
      req.db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error adding user: ' + err.stack);
            return res.status(500).send('Error adding user');
          }

          const userId = result.insertId; // ✅ Correct way to get inserted ID

          // Insert into profiles
          req.db.query(
            'INSERT INTO profiles (user_id, full_name, bio) VALUES (?, ?, ?)',
            [userId, full_name || '', bio || ''],
            (err2) => {
              if (err2) {
                console.error('Error adding profile: ' + err2.stack);
                return res.status(500).send('Error adding profile');
              }

              // ✅ Redirect to users list only after both inserts succeed
              res.redirect('/users');
            }
          );
        }
      );
    } catch (hashError) {
      console.error('Error hashing password: ' + hashError);
      res.status(500).send('Error processing password');
    }
  });
});

// Show Edit User form
router.get('/edit/:id', isLoggedIn, (req, res) => {
  const userId = req.params.id;
  req.db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(404).send('User not found');

    res.render('module/users/edit', { title: 'Edit User', user: results[0] });
  });
});

// Handle Update User
router.post('/edit/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  if (!username || !email) return res.status(400).send('Username and Email required');

  let query = '';
  let params = [];

  if (password) {
    // Hash new password if provided
    const hashedPassword = await bcrypt.hash(password, 10);
    query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
    params = [username, email, hashedPassword, userId];
  } else {
    query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    params = [username, email, userId];
  }

  req.db.query(query, params, (err) => {
    if (err) return res.status(500).send('Error updating user');
    res.redirect('/users');
  });
});


// Delete user
router.get('/delete/:id', isLoggedIn, (req, res) => {
  const userId = req.params.id;

  req.db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user: ' + err.stack);
      return res.status(500).send('Error deleting user');
    }

    res.redirect('/users');
  });
});


module.exports = router;
