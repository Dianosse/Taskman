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

        res.status(201).json({
            success: true,
            token,
            data : {
                user
            }
        });

    } catch (error) {
        res.status(400).json(error);
    }
}

async function loginUser(req, res) {
    try {
        const {email, password} = req.body;

        console.log(email, password);

        const userExistant = await userModel.findOne({
            where :
                {
                    email : email
                }
        });

        if (userExistant === null) {
            res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé'
            });
        }

        const match = await passwordUtils.comparePassword(userExistant.password_hash, password);

        if (!match) {
            res.status(401).json({
                success: false,
                error: 'Mauvais mot de passe'
            });
        }

        const token = jwtUtils.generateToken(userExistant.id);

        res.json({
            success: true,
            token,
            data : {
                userExistant
            }
        });

    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports = {
    registerUser,
    loginUser
};