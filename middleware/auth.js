const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null ) return res.json({message: "No Auth Token"})

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.json({err: "Unable to verify token"});
    req.user = user;
    next();
  })
}
