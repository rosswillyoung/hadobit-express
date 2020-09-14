const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    // console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log(id); //THIS IS NOT BEING CALLED
    User.findById(id, (err, user) => {
      console.log(user);
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({username: username}, (err, user) => {
        if (err) { return done(err); }
        if (!user) {return done(null, false);}
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(!isMatch) {
            console.log('no match')
            // req.authError = "Password doesn't match";
            return done(null, false);
          }
          // console.log('match')
          // res.locals.user = user
          // console.log(user);
          return done(null, user);
        });
      });
    }));
}
