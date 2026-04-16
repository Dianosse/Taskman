const usersModels = require('../models/users');
const annonceModels = require('../models/annonces');


async function getUserById(req, res) {
    try {
        const id = req.params.id;

        const user = await usersModels.findByPk(id);

        if (!user) {
            return res.status(404).json({message : "User not found"});
        }

        res.json({
            success: true,
            data : {
                id : user.id,
                email : user.email,
                username : user.username,
                bio : user.bio
            }
        });
    } catch (error) {
        res.status(400).json(error);
    }
}

async function getInfos(req, res) {
    try {
        res.json({
            success: true,
            data : {
                id : req.user.id,
                email : req.user.email,
                username : req.user.username,
                bio : req.user.bio
            }
        });
    } catch (err) {
        res.status(400).json(err);
    }
}

// TODO : vérifier que l'email est pas déjà utilisé par un autre compte si c'est un truc modif

async function changeInfosUserById(req, res) {
    try {
        const id_user = req.params.id;
        const id_user_int = parseInt(req.params.id);

        if (req.user.id !==  id_user_int) {
            return res.status(401).json({
                success: false,
                error: 'Impossible de modifier un autre utilisateur que soit même'
            });
        }

        const user = await usersModels.findByPk(id_user);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        const {email, username, bio} = req.body;

        await user.update(
            {
                email,
                username,
                bio
            });

        res.json({
            success: true,
            data : {
                id : user.id,
                email : user.email,
                username : user.username,
                bio : user.bio
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteUserById(req, res) {
    try {
        const user_id = req.params.id;
        const id_user_int = parseInt(req.params.id);

        if (req.user.id !== id_user_int) {
            return res.status(401).json({
                success: false,
                error: 'Impossible de supprimer un autre utilisateur que soit même'
            });
        }

        const user = await usersModels.findByPk(user_id);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        await user.destroy();

        res.status(201).json({
            success: true,
            infos : "Utilisateur delete avec succès"
        });
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getMesAnnonces(req, res) {
    try {
        const mesAnnonces = await annonceModels.findAll({
            where : {
                id_creator : req.user.id
            }
        });

        res.json({
            success: true,
            data : {
                mesAnnonces
            }
        });
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getAnnoncesByUser(req, res) {
    try {
        const id = parseInt(req.params.id)

        const annonces = await annonceModels.findAll({
            where: { id_creator: id }
        })

        res.json({
            success: true,
            data: {
                annonces
            }
        })
    } catch (err) {
        res.status(400).json(err)
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