const usersModels = require('../models/users');
const annonceModels = require('../models/annonces');


async function getUserById(req, res) {
    try {
        const id = req.params.id;

        const user = await usersModels.findByPk(id);

        if (!user) {
            return res.status(404).json({message : "User not found"});
        }

        return res.status(201).json({
            success: true,
            data : {
                id : user.id,
                email : user.email,
                username : user.username,
                bio : user.bio,
                city : user.city
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function getInfos(req, res) {
    try {
        return res.status(201).json({
            success: true,
            data : {
                id : req.user.id,
                email : req.user.email,
                username : req.user.username,
                bio : req.user.bio,
                city : req.user.city
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function changeInfosUserById(req, res) {
    try {
        const id_user = req.params.id;
        const id_user_int = parseInt(req.params.id);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (req.user.id !== id_user_int) {
            return res.status(403).json({
                success: false,
                error: "Impossible de modifier un autre utilisateur que soi-même"
            });
        }

        const user = await usersModels.findByPk(id_user);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "L'utilisateur n'existe pas"
            });
        }

        const { email, username, bio, city } = req.body;

        if (email !== undefined) {
            if (!emailRegex.test(email) || email.length > 50) {
                return res.status(400).json({
                    success: false,
                    error: "Email invalide"
                });
            }

            const user_check = await usersModels.findOne({
                where: { email }
            });

            if (user_check && user_check.id !== req.user.id) {
                return res.status(409).json({
                    success: false,
                    error: "Email déjà utilisé"
                });
            }
        }

        if (username !== undefined && (username.trim().length < 3 || username.trim().length > 32)) {
            return res.status(400).json({
                success: false,
                error: "Username invalide"
            });
        }

        if (bio !== undefined && (bio.trim().length === 0 || bio.length > 100)) {
            return res.status(400).json({
                success: false,
                error: "Bio invalide"
            });
        }

        if (city !== undefined && (city.trim().length === 0 || city.length > 32)) {
            return res.status(400).json({
                success: false,
                error: "Ville invalide"
            });
        }

        await user.update({
            email,
            username,
            bio,
            city
        });

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                city: user.city
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function deleteUserById(req, res) {
    try {
        const user_id = req.params.id;
        const id_user_int = parseInt(req.params.id);

        if (req.user.id !== id_user_int) {
            return res.status(403).json({
                success: false,
                error: "Impossible de supprimer un autre utilisateur que soi-même"
            });
        }

        const user = await usersModels.findByPk(user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "L'utilisateur n'existe pas"
            });
        }

        await user.destroy();

        return res.status(200).json({
            success: true,
            infos: "Utilisateur supprimé avec succès"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function getMesAnnonces(req, res) {
    try {
        const mesAnnonces = await annonceModels.findAll({
            where : {
                id_creator : req.user.id
            }
        });

        return res.status(201).json({
            success: true,
            data : {
                mesAnnonces
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function getAnnoncesByUser(req, res) {
    try {
        const id = parseInt(req.params.id)

        const annonces = await annonceModels.findAll({
            where: { id_creator: id }
        })

        return res.status(201).json({
            success: true,
            data: {
                annonces
            }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    getUserById,
    getInfos,
    changeInfosUserById,
    deleteUserById,
    getMesAnnonces,
    getAnnoncesByUser
};