const favorisModels = require('../models/favoris');
const usersModels = require("../models/users");
const jwt = require("jsonwebtoken");

async function allFavoris(req, res) {
    try {
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        let id_creator = token_decoded.userId;

        const allFavoris = await favorisModels.findAll({
            where: {
                id_user: id_creator
            }
        });

        res.json({
            success: true,
            data: {
                allFavoris
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function addFavoris(req, res) {
    try {
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        const id_user = token_decoded.userId;
        const id_annonce = req.params.id;

        const favoris = await favorisModels.create({
            id_user,
            id_annonce
        });

        res.json({
            success: true,
            data: {
                favoris
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteFavoris(req, res) {
    try {
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        const id_user = token_decoded.userId;
        const id_annonce = req.params.id;

        const favoris = await favorisModels.findOne({
            where :
                {
                    id_user : id_user,
                    id_annonce : id_annonce
                }
        });

        if(!favoris) {
            return res.status(401).json({
                success: false,
                error: 'Ce favoris n\'existe pas'
            });
        }

        await favoris.destroy();

        res.status(201).json({
            success: true,
            infos : "Favoris delete avec succès"
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    allFavoris,
    addFavoris,
    deleteFavoris
}