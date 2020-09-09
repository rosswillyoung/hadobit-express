
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user');


// Handle user registration.
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
          // console.log(newUser);
        }
      });
    });
  });
  // res.send('Success');
});

// router.post('/users/login', passport.authenticate('local', (req, res, next) => {
//   // console.log(req.session);
//   req.logIn(user, (err) => {
//     if (err) {throw err;}
//   });
//   return res.json({
//     loggedIn: true,
//   })(req, res, next);
// }))


router.post('/users/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err){console.log(err);}
    if (!user) { console.log('No User');}
    else {
      req.logIn(user, (err) => {
        if (err) {console.log('Error');}
        else {
          req.session.cookie.user = user;
          console.log(req.session);
          // res.cookie('User', user);
          // console.log(req.user)
        }
      })
    }
    return res.json({
      loggedIn: true
    })
  })(req, res, next);
});

module.exports = router;
