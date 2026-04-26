const favorisModels = require('../models/favoris');
const annonceModels = require('../models/annonces');


async function allFavoris(req, res) {
    try {
        const [allFavoris] = await annonceModels.sequelize.query(
            `
            SELECT a.*
            FROM annonces a
            INNER JOIN favoris f ON a.id = f.id_annonce
            WHERE f.id_user = :id_user
            `,
            {
                replacements: { id_user: req.user.id }
            }
        );

        return res.status(201).json({
            success: true,
            data: {
                allFavoris
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function addFavoris(req, res) {
    try {
        const id_user = req.user.id;
        const id_annonce = req.params.id;

        const annonce = await annonceModels.findByPk(id_annonce);
        if (!annonce) {
            return res.status(404).json({
                success: false,
                error: "L'annonce n'existe pas"
            });
        }

        const fav = await favorisModels.findOne({
            where : {
                id_user,
                id_annonce
            }
        });

        if (fav) {
            return res.status(409).json({
                success: false,
                error: "Cette annonce est déjà en favoris pour cet utilisateur"
            });
        }

        const favoris = await favorisModels.create({
            id_user,
            id_annonce
        });

        return res.status(201).json({
            success: true,
            data: { favoris }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function deleteFavoris(req, res) {
    try {
        const id_user = req.user.id;
        const id_annonce = req.params.id;

        const favoris = await favorisModels.findOne({
            where :
                {
                    id_user : id_user,
                    id_annonce : id_annonce
                }
        });

        if (!favoris) {
            return res.status(404).json({
                success: false,
                error: "Ce favoris n'existe pas"
            });
        }

        await favoris.destroy();

        return res.status(200).json({
            success: true,
            infos: "Favoris supprimé avec succès"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    allFavoris,
    addFavoris,
    deleteFavoris
}