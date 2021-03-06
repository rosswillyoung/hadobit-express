const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
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

router.get('/users/login', (req, res) => {
  // if (req.session.passport)
  if (req.session.passport) {
    res.json({
      hello: "world",
      user: req.session.passport.user
    })

  }
})

router.post('/users/login', passport.authenticate('local'), (req, res, err) => {
  if (err) {
    console.log(err);
    // throw(err)
  }
  // console.log(req.session.passport.user);
  const accessToken = jwt.sign({ username: req.body.username }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
  res.json({
    accessToken,
    user: req.session.passport.user
  })

  // res.locals.user = req.session.passport.user
  // console.log("RES.LOCALS.USER: " + res.locals.user);
  // return res.json({
  //   loggedIn: true,
  //   user: req.session.passport.user
  // });
})



module.exports = router;
