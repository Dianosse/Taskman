const usersController = require('../controllers/user.controllers')

const router = require('express').Router();

router.route("/").get(usersController.allUsers);

router.route("/:id").get(usersController.getUserById)
                            .put(usersController.changeInfosUserById)
                            .delete(usersController.deleteUserById);

router.route("/me").get(usersController.getInfos);

module.exports = router;