const usersController = require('../controllers/user.controllers')

const router = require('express').Router();

router.route("/").get(usersController.allUsers);

router.route("/:id").get(usersController.getUserById);

module.exports = router;