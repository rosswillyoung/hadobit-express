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
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

app.use(cookieParser());
app.use(session({cookieName: "session", secret: "keyboardcat", duration: 10000, activeDuration: 100000}));


app.use(express.static('public'));

// CORS
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
// app.use(cors({methods: ['GET', 'POST'], credentials: true}));
// , origin: 'http://localhost:3000'

// Passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(tasks);
app.use(users);

app.listen(4100, () => {
  console.log('Sever listening on port 4100');
});
