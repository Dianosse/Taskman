const jwt = require("jsonwebtoken");
const usersModels = require('../models/users');
const annonceModels = require('../models/annonces');

async function allUsers(req, res) {
    try {
        const allUsers = await usersModels.findAll();
        res.json({
            success: true,
            data : {
                allUsers
            }
        });
    } catch (error) {
        res.status(400).json(err);
    }
}

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
                user
            }
        });
    } catch (error) {
        res.status(400).json(err);
    }
}

async function getInfos(req, res) {
    try {
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        res.json({
            success: true,
            data : {
                user
            }
        });


    } catch (err) {
        res.status(400).json(err);
    }
}


async function changeInfosUserById(req, res) {
    try {
        let id_user = req.params.id;

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
                user
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteUserById(req, res) {
    try {
        let user_id = req.params.id;

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
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const user = await usersModels.findByPk(token_decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        const mesAnnonces = await annonceModels.findAll({
            where : {
                id_creator : user.id
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

module.exports = {
    allUsers,
    getUserById,
    getInfos,
    changeInfosUserById,
    deleteUserById,
    getMesAnnonces
};