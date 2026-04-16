const usersController = require('../controllers/user.controllers')

const router = require('express').Router();

router.route("/me").get(usersController.getInfos);

router.route("/me/annonces").get(usersController.getMesAnnonces);

router.route("/:id").get(usersController.getUserById)
                            .put(usersController.changeInfosUserById)
                            .delete(usersController.deleteUserById);

router.route("/:id/annonces").get(usersController.getAnnoncesByUser);

module.exports = router;