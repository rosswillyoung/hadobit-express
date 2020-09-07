
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const tasks = require('./routes/tasks');
const users = require('./routes/users')
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/hadobit')
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


// //Bring in Models
// let Task = require('./models/task');


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use(cors());

//Express Session middleware
app.use(session({
  secret: 'thisisthesecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true}
}));


// Express Router middleware
app.use(tasks);
app.use(users);
// app.use('/', (req, res, next) => {
//   res.send('middleware');
// });

// app.get('/api', (req, res) => {
//   res.json({
//     message: 'Welcome to the API'
//   });
// });
//
// app.post('api/login', (req, res)=> {
//   jwt.sign();
// });

app.listen(4100, () => {
  console.log('Sever listening on port 4100');
});
