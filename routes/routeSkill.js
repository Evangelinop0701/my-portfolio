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

router.get('/form', isLoggedIn, (req, res) => {
    res.render('module/skills/form_skill', { title: 'Add Skill' });
});

router.post('/add', isLoggedIn, (req, res) => {
  const userId = req.session.userId;        
    const {skill, ktg, icon, durasaun } = req.body;

    req.db.query('INSERT INTO skills (user_id, skill_name, ktg, icon, durasaun) VALUES (?, ?, ?, ?, ?)', [userId, skill, ktg, icon, durasaun], (err, result) => {
        if (err) {
            console.error('Error adding skill: ' + err.stack);
            return res.status(500).send('Error adding skill');
        }
        res.redirect('/skills');
    });
});

router.get('/edit/:id', isLoggedIn, (req, res) => {
  const skillId = req.params.id;
    const userId = req.session.userId;  
    req.db.query('SELECT * FROM skills WHERE id = ? AND user_id = ?', [skillId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching skill: ' + err.stack);
            return res.status(500).send('Error fetching skill');
        }
        if (results.length === 0) {
            return res.status(404).send('Skill not found');
        }
        res.render('module/skills/form_edit', { title: 'Edit Skill', data: results[0] });
    });
});

router.post('/update/:id', isLoggedIn, (req, res) => {
  const skillId = req.params.id;
    const userId = req.session.userId;  
    const { skill, ktg, icon, durasaun } = req.body;

    req.db.query('UPDATE skills SET skill_name = ?, ktg = ?, icon = ?, durasaun = ? WHERE id = ? AND user_id = ?', [skill, ktg, icon, durasaun, skillId, userId], (err, result) => {
        if (err) {
            console.error('Error updating skill: ' + err.stack);
            return res.status(500).send('Error updating skill');
        }
        res.redirect('/skills');
    });
});

router.post('/delete/:id', isLoggedIn, (req, res) => {
  const skillId = req.params.id;
    const userId = req.session.userId;
    req.db.query('DELETE FROM skills WHERE id = ? AND user_id = ?', [skillId, userId], (err, result) => {
        if (err) {
            console.error('Error deleting skill: ' + err.stack);
            return res.status(500).send('Error deleting skill');
        }
        res.redirect('/skills');
    });
});
module.exports = router;