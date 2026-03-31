const annoncesModels = require('../models/annonces');
const jwt = require("jsonwebtoken");
const usersModels = require("../models/users");
const { Op } = require("sequelize");

async function allAnnonces(req, res) {
    try {
        const { search, type, category, city, sort } = req.query;

        const where = {};
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

        const annonces = await annoncesModels.findAll({
            where,
            order
        });

        res.json({
            success: true,
            data: {
                annonces
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}
async function getAnnonceById(req, res) {
    try {
        let annonce_id = req.params.id;

        const annonce = await annoncesModels.findByPk(annonce_id);

        if (!annonce) {
            return res.status(401).json({
                success: false,
                error: 'L\'annonce n\'existe pas'
            });
        }

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

async function createAnnonce(req, res) {
    try {
        const {titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at} = req.body;

        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }


        let id_creator = token_decoded.userId;

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
            published_at,
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

        const {titre, description, type, city, category, availability, tarif_type, tarif, modality, status} = req.body;

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

        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        let id_creator = token_decoded.userId;

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

        console.log(status);

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

async function allAnnoncesPublished(req, res) {
    try {
        const allAnnoncesPublished = await annoncesModels.findAll({
            where : {
                status : "PUBLISHED"
            }
        });

        res.json({
            success: true,
            data : {
                allAnnoncesPublished
            }
        });
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getCategoryPossible(req, res) {
    try {
        res.json({
            success: true,
            data : {
                categorys : [
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
    allAnnoncesPublished,
    getCategoryPossible
};