const annoncesModels = require('../models/annonces');
const usersModels = require('../models/users');
const { Op } = require("sequelize");


/**
 * Retourne toutes les annonces publiées qui correspondent aux potentiels filtres
 * Possibilité de filtrage via mots clefs (titre/description) / type / catégorie / city
 * Il est également possible de filtrer le résultat par ordre croissant ou décroissant selon le prix de l'annonce
 * Pagination du résultat
 */
async function allAnnonces(req, res) {
    try {
        const { search, type, category, city, sort } = req.query;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const offset = (page - 1) * limit;

        // construction des filtres selon les paramètres envoyés
        const where = {
            status: "PUBLISHED"
        };
        const order = [];

        if (type) {
            where.type = type;
        }

        if (category) {
            where.category = category;
        }

        if (city) {
            where.city = city;
        }

        if (search) {
            where[Op.or] = [
                { titre: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (sort === "recent") {
            order.push(["published_at", "DESC"]);
        }

        if (sort === "price_asc") {
            order.push(["tarif", "ASC"]);
        }

        if (sort === "price_desc") {
            order.push(["tarif", "DESC"]);
        }

        // Récupère les annonces voulues mais également le nombre d'annonces qu'il y a
        const { count, rows } = await annoncesModels.findAndCountAll({
            where,
            order,
            limit,
            offset
        });

        return res.status(201).json({
            success: true,
            data: {
                annonces: rows
            },
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


/**
 * Retourne les informations relatives à une annonce dont l'ID est envoyé.
 * Retourne également des informations basiques concernant l'utilisateur qui est le créateur de cette annonce.
 * @Condition : L'annonce dont l'ID est envoyé doit exister en BD
 */
async function getAnnonceById(req, res) {
    try {
        const annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                error: "L'annonce n'existe pas"
            });
        }

        const user = await usersModels.findByPk(annonce.id_creator);

        return res.status(201).json({
            success: true,
            data : {
                annonce : {
                    annonce,
                    "creator" : {
                        "id" : user.id,
                        "username" : user.username
                    }
                }
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


/**
 * Crée une annonce selon les paramètres envoyés.
 * Tous les champs doivent être présents et dans le bon format
 */
async function createAnnonce(req, res) {
    try {
        const {titre, description, type, city, category, availability, tarif_type, tarif, modality, status} = req.body;

        const id_creator = req.user.id;

        // listes fixes des catégories et des modalités possibles
        const categories = ["Design", "Cours", "Bricolage", "Cuisine", "Informatique", "Aide", "Baby-sitting"];
        const modalities = ["REMOTE", "AT_PROVIDER", "AT_CUSTOMER"];

        if (!titre || titre.trim().length < 3) {
            return res.status(400).json({ success: false, error: "Titre invalide" });
        }

        if (!description || description.trim() === "") {
            return res.status(400).json({ success: false, error: "Description invalide" });
        }

        if (!["OFFER", "REQUEST"].includes(type)) {
            return res.status(400).json({ success: false, error: "Type invalide" });
        }

        if (!category || !categories.includes(category)) {
            return res.status(400).json({ success: false, error: "Catégorie invalide" });
        }

        if (!city || city.trim() === "") {
            return res.status(400).json({ success: false, error: "Ville invalide" });
        }

        if (availability && availability.trim() === "") {
            return res.status(400).json({ success: false, error: "Disponibilité invalide" });
        }

        if (!["FREE", "HOURLY", "FIXED"].includes(tarif_type)) {
            return res.status(400).json({ success: false, error: "Type de tarif invalide" });
        }

        if (tarif_type === "FREE" && tarif !== 0) {
            return res.status(400).json({ success: false, error: "Le tarif doit être 0 pour FREE" });
        }

        if (["HOURLY", "FIXED"].includes(tarif_type)) {
            if (tarif === undefined || isNaN(tarif) || tarif <= 0) {
                return res.status(400).json({ success: false, error: "Tarif invalide" });
            }
        }

        if (!modality || !modalities.includes(modality)) {
            return res.status(400).json({ success: false, error: "Modalité invalide" });
        }

        if (status && !["DRAFT", "PUBLISHED"].includes(status)) {
            return res.status(400).json({ success: false, error: "Status invalide" });
        }

        const annonce = await annoncesModels.create({
            titre,
            description,
            type,
            city,
            category,
            availability,
            tarif_type,
            tarif,
            modality,
            status,
            id_creator
        });

        return res.status(201).json({
            success: true,
            data: {
                annonce
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


/**
 * Permet la modification d'une annonce dont l'ID est envoyé.
 * @Conditions :
 *  - l'ID envoyé doit correspondre à une annonce existante
 *  - l'utilisateur actuellement connecté doit être le créateur de cette annonce
 *  - la nouvelle version des champs doit être au bon format
 */
async function modifyAnnonce(req, res) {
    try {
        const annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                error: "L'annonce n'existe pas"
            });
        }

        if (req.user.id !== annonce.id_creator) {
            return res.status(403).json({
                success: false,
                error: "Impossible de modifier une annonce qu'on n'a pas créée"
            });
        }

        const {titre, description, type, city, category, availability, tarif_type, tarif, modality, status} = req.body;

        const categories = ["Design", "Cours", "Bricolage", "Cuisine", "Informatique", "Aide", "Baby-sitting"];
        const modalities = ["REMOTE", "AT_PROVIDER", "AT_CUSTOMER"];

        if (titre !== undefined && titre.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: "Titre invalide"
            });
        }

        if (description !== undefined && description.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Description invalide"
            });
        }

        if (type !== undefined && !["OFFER", "REQUEST"].includes(type)) {
            return res.status(400).json({
                success: false,
                error: "Type invalide"
            });
        }

        if (category !== undefined && !categories.includes(category)) {
            return res.status(400).json({
                success: false,
                error: "Catégorie invalide"
            });
        }

        if (city !== undefined && city.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Ville invalide"
            });
        }

        if (availability !== undefined && availability.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Disponibilité invalide"
            });
        }

        if (tarif_type !== undefined && !["FREE", "HOURLY", "FIXED"].includes(tarif_type)) {
            return res.status(400).json({
                success: false,
                error: "Type de tarif invalide"
            });
        }

        if (modality !== undefined && !modalities.includes(modality)) {
            return res.status(400).json({
                success: false,
                error: "Modalité invalide"
            });
        }

        if (status !== undefined && !["DRAFT", "PUBLISHED"].includes(status)) {
            return res.status(400).json({
                success: false,
                error: "Status invalide"
            });
        }

        if (tarif_type === "FREE" && tarif !== undefined && tarif !== 0) {
            return res.status(400).json({
                success: false,
                error: "Le tarif doit être 0 pour FREE"
            });
        }

        if (tarif !== undefined && (isNaN(tarif) || tarif < 0)) {
            return res.status(400).json({
                success: false,
                error: "Tarif invalide"
            });
        }

        if ((tarif_type === "HOURLY" || tarif_type === "FIXED") && tarif !== undefined && tarif <= 0) {
            return res.status(400).json({
                success: false,
                error: "Le tarif doit être supérieur à 0"
            });
        }

        await annonce.update(
            {
                titre,
                description,
                type,
                city,
                category,
                availability,
                tarif_type,
                tarif,
                modality,
                status
            });

        return res.status(201).json({
            success: true,
            data : {
                annonce
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


/**
 * Permet la suppression en BD de l'annonce dont l'ID est envoyé
 * @Conditions :
 *  - l'ID doit correspondre à une annonce existante
 *  - l'utilisateur actuellement connecté doit être le créateur de cette annonce
 */
async function deleteAnnonce(req, res) {
    try {
        const annonce_id  = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                error: "L'annonce n'existe pas"
            });
        }

        if (req.user.id !== annonce.id_creator) {
            return res.status(403).json({
                success: false,
                error: "Impossible de supprimer une annonce qu'on n'a pas créée"
            });
        }

        await annonce.destroy();

        return res.status(200).json({
            success: true,
            infos: "Annonce supprimée avec succès"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


/**
 * Permet la modification uniquement du statut d'une annonce, entre "DRAFT" ou "PUBLISHED"
 * @Conditions :
 *  - l'ID envoyé doit correspondre à une annonce existante
 *  - l'utilisateur actuellement connecté doit être le créateur de cette annonce
 *  - Le nouveau statut doit être "DRAFT" ou "PUBLISHED"
 */
async function changeAnnonceStatus(req, res) {
    try {
        const annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if (!annonce) {
            return res.status(404).json({
                success: false,
                error: "L'annonce n'existe pas"
            });
        }

        const id_creator = req.user.id;

        if (annonce.id_creator !== id_creator) {
            return res.status(403).json({
                success: false,
                error: "Cette annonce n'appartient pas à cet utilisateur"
            });
        }

        const {status} = req.body;

        if (!(status.localeCompare("DRAFT") === 0 || status.localeCompare("PUBLISHED") === 0)) {
            return res.status(400).json({
                success: false,
                error: "Status impossible"
            });
        }

        await annonce.update({
            status
        });

        return res.status(201).json({
            success: true,
            data : {
                annonce
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


/**
 * Renvoie d'une liste fixe des catégories possibles pour la création d'une annonce.
 */
async function getCategoriesPossible(req, res) {
    try {
        return res.status(201).json({
            success: true,
            data : {
                categories : [
                    "Design",
                    "Cours",
                    "Bricolage",
                    "Cuisine",
                    "Informatique",
                    "Aide",
                    "Baby-sitting"
                ]
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


module.exports = {
    allAnnonces,
    getAnnonceById,
    createAnnonce,
    modifyAnnonce,
    deleteAnnonce,
    changeAnnonceStatus,
    getCategoriesPossible
};