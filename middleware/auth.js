const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  // We have access to req object which has a header property
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  // decode the token
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));

    req.user = decoded.user;
    // what is next() used for
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
