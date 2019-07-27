const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
//instead of 'express-validator/check' we use express-validator

const User = require('../../models/User');

// request type                @route   POST api/users
// what request does           @desc    Register user
// access value public/private @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email }); //{email:email}

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', //string of 200
        r: 'pg', // rating
        d: 'mm', //gives a default image as a user icon
      });

      // to create an instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password --using bcrypt
      // 10 in genSalt is called round here, the more is the more secure but slower
      const salt = await bcrypt.genSalt(10);

      // take password and hash it
      user.password = await bcrypt.hash(password, salt);

      // user.save to save the instance to database
      await user.save();

      // Return jsonwebtoken
      // Create our payload
      const payload = { user: { id: user.id } };
      jwt.sign(payload, config.get('jwtToken'), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
      // res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
