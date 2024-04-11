const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

// Set the maximum number of listeners for EventEmitters globally
require('events').EventEmitter.defaultMaxListeners = 15;

const UserController = require('../controllers/user');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

router.get('/', UserController.user_get);

module.exports = router;
