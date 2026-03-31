const authController = require('../controllers/auth.controllers');

const router = require('express').Router();

router.route('/register').post(authController.registerUser);

router.route('/login').post(authController.loginUser);

router.route('/logout').post(authController.logoutUser);

module.exports = router;