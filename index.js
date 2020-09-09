const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const config = require('./config/database');
const session = require('express-session');



mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to mongodb');
});

// Check for DB errors
db.on('error', (err) => {
  console.log(err);
});

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static('public'));
app.use(session({
  secret: "asdlkfjhasdlfjkh",
  cookie: {
    maxAge: 600000
  }
}));

// CORS
app.use(cors({methods: ['GET', 'POST'], origin: 'http://localhost:3000', credentials: true}));


// Passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.get('*', (req, res, next) => {
  res.locals.session = req.user || null;
  console.log(req.session);
  // console.log(res.locals.user);
  next();
});

// Express Router middleware

app.use(tasks);
// let users = require('./routes/users')(passport);
app.use(users);

app.listen(4100, () => {
  console.log('Sever listening on port 4100');
});
