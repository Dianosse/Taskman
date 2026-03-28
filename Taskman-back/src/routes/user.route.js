const usersController = require('../controllers/user.controllers')

const router = require('express').Router();

router.route("/").get(usersController.allUsers);

router.route("/me").get(usersController.getInfos);

router.route("/:id").get(usersController.getUserById)
                            .put(usersController.changeInfosUserById)
                            .delete(usersController.deleteUserById);

module.exports = router;