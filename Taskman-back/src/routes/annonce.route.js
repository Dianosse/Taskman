const annonceController = require('../controllers/annonce.controllers');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route("/").get(annonceController.allAnnonces);

router.route("/:id").get(annonceController.getAnnonceById);

router.use(protect);

router.route("/").post(annonceController.createAnnonce);

router.route("/:id").put(annonceController.modifyAnnonce)
    .delete(annonceController.deleteAnnonce);

module.exports = router;