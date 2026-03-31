const userModel = require('../models/users')
const passwordUtils = require('../utils/passwordHash');
const jwtUtils = require('../utils/jwt');

async function registerUser(req, res) {
    try {
        const {email, username, password, passwordConfirm, bio} = req.body;

        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                error: 'Les mots de passe ne correspondent pas'
            });
        }

        const userExistant = await userModel.findOne({
            where :
                {
                    email : email
                }
        });

        if(userExistant != null) {
            return res.status(409).json({
                success: false,
                error: 'Email déjà utilisé'
            });
        }

        const password_hash = await passwordUtils.hashPassword(password);

        const user = await userModel.create({
            email,
            password_hash,
            username,
            bio
        });

        const token = jwtUtils.generateToken(user.id);

        return res.status(201).json({
            success: true,
            token,
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

async function loginUser(req, res) {
    try {
        const {email, password} = req.body;

        const userExistant = await userModel.findOne({
            where :
                {
                    email : email
                }
        });

        if (userExistant === null) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé'
            });
        }

        const match = await passwordUtils.comparePassword(userExistant.password_hash, password);

        if (!match) {
            return res.status(401).json({
                success: false,
                error: 'Mauvais mot de passe'
            });
        }

        const token = jwtUtils.generateToken(userExistant.id);

        return res.json({
            success: true,
            token,
            data : {
                id : userExistant.id,
                email : userExistant.email,
                username : userExistant.username,
                bio : userExistant.bio
            }
        });

    } catch (error) {
        res.status(400).json(error);
    }
}

async function logoutUser(req, res) {
    try{
        res.json({
            success: true,
            data : {
                message: "Utilisateur déconnecté avec succès"
            }
        });
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};