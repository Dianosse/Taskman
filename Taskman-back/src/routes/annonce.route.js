const annonceController = require('../controllers/annonce.controllers');
const protect = require("../middlewares/auth");

const router = require('express').Router();

router.route("/").get(annonceController.allAnnonces);

router.route("/allPublished").get(annonceController.allAnnoncesPublished);

router.route("/:id").get(annonceController.getAnnonceById);

// TODO : route : catégory (liste fixe)

router.use(protect);

router.route("/").post(annonceController.createAnnonce);

router.route("/:id").put(annonceController.modifyAnnonce)
    .delete(annonceController.deleteAnnonce);

router.route("/:id/status").patch(annonceController.changeAnnonceStatus);

module.exports = router;