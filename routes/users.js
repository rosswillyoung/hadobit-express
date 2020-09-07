
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/user');

// Register Form
// router.get('/users/register', )
router.post('/users/create', (req, res) => {
  let newUser = new User();
  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.password = req.body.password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save((err) => {
        if (err) {
          console.log(err);
          return;
        } else {
          res.send('Success')
          console.log(newUser);
        }
      });
    });
  });
  // res.send('Success');
});

router.post('/users/login', (req, res) => {
  return;
});

module.exports = router;
