const favorisControllers = require('../controllers/favoris.controllers');

const router = require('express').Router();

router.route("/").get(favorisControllers.allFavoris);

router.route("/:id").post(favorisControllers.addFavoris)
    .delete(favorisControllers.deleteFavoris);

module.exports = router;