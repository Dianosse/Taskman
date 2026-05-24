const usersController = require('../controllers/user.controllers');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route("/me").get(protect, usersController.getInfos);

router.route("/me/annonces").get(protect, usersController.getMesAnnonces);

router.route("/:id").get(usersController.getUserById);

router.route("/:id/annonces").get(usersController.getAnnoncesByUser);

router.use(protect);

router.route("/:id").put(usersController.changeInfosUserById)
                            .delete(usersController.deleteUserById);

module.exports = router;