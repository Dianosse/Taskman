const annoncesModels = require('../models/annonces');
const usersModels = require('../models/users');
const { Op } = require("sequelize");

async function allAnnonces(req, res) {
    try {
        const { search, type, category, city, sort } = req.query;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const offset = (page - 1) * limit;

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

        const { count, rows } = await annoncesModels.findAndCountAll({
            where,
            order,
            limit,
            offset
        });

        res.json({
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
        res.status(400).json(err);
    }
}

async function getAnnonceById(req, res) {
    try {
        const annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if (!annonce) {
            return res.status(401).json({
                success: false,
                error: 'L\'annonce n\'existe pas'
            });
        }

        const user = await usersModels.findByPk(annonce.id_creator);

        res.json({
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
        res.status(400).json(err);
    }
}

async function createAnnonce(req, res) {
    try {
        const {titre, description, type, city, category, availability, tarif_type, tarif, modality, status} = req.body;

        const id_creator = req.user.id;

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

        res.json({
            success: true,
            data: {
                annonce
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function modifyAnnonce(req, res) {
    try {
        const annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if(!annonce) {
            return res.status(401).json({
                success: false,
                error: 'L\'annonce n\'existe pas'
            });
        }

        if (req.user.id !== annonce.id_creator) {
            return res.status(401).json({
                success: false,
                error: 'Impossible de modifier une annonce qu\'on a pas créé'
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

        res.json({
            success: true,
            data : {
                annonce
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteAnnonce(req, res) {
    try {
        const annonce_id  = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if(!annonce) {
            return res.status(401).json({
                success: false,
                error: 'L\'annonce n\'existe pas'
            });
        }

        if (req.user.id !== annonce.id_creator) {
            return res.status(401).json({
                success: false,
                error: 'Impossible de supprimer une annonce qu\'on a pas créé'
            });
        }

        await annonce.destroy();

        res.status(201).json({
            success: true,
            infos : "Annonce delete avec succès"
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function changeAnnonceStatus(req, res) {
    try {
        const annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if(!annonce) {
            return res.status(401).json({
                success: false,
                error: 'L\'annonce n\'existe pas'
            });
        }

        const id_creator = req.user.id;

        if (annonce.id_creator !== id_creator) {
            return res.status(400).json({
                success: false,
                error: "cette annonce n'appartient pas à cette utilisateur"
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

        res.json({
            success: true,
            data : {
                annonce
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function getCategoriesPossible(req, res) {
    try {
        res.json({
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
        res.status(400).json(err);
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