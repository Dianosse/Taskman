const userModel = require('../models/users')
const passwordUtils = require('../utils/passwordHash');
const jwtUtils = require('../utils/jwt');

/**
 * Permet la création d'un compte, tous les champs (email, username, password, passwordConfirm, bio, city) doivent être présents dans le bon format
 * Condition mot de passe : au moins 8 caractères / une minuscule / une majuscule / un caractère spécial / un chiffre
 * @Condition : aucun autre utilisateur ne doit avoir l'email de ce nouveau compte
 */
async function registerUser(req, res) {
    try {
        const {email, username, password, passwordConfirm, bio, city} = req.body;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !username || !password || !passwordConfirm || !bio || !city) {
            return res.status(400).json({
                success: false,
                error: "Tous les champs sont obligatoires"
            });
        }

        if (username.trim().length < 3 || username.trim().length > 32) {
            return res.status(400).json({
                success: false,
                error: "Username invalide"
            });
        }

        if (bio.trim().length === 0 || bio.length > 100) {
            return res.status(400).json({
                success: false,
                error: "Bio invalide"
            });
        }

        if (city.trim().length === 0 || city.length > 32) {
            return res.status(400).json({
                success: false,
                error: "Ville invalide"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Format de mail invalide"
            });
        }

        if (email.length > 50) {
            return res.status(400).json({
                success: false,
                error: "Email trop long"
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                error: "Les mots de passe ne correspondent pas"
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error: "Mot de passe trop faible"
            });
        }

        // recherche d'un utilisateur contenant l'email envoyé depuis le front
        const userExistant = await userModel.findOne({
            where: { email }
        });

        if (userExistant) {
            return res.status(409).json({
                success: false,
                error: "Email déjà utilisé"
            });
        }

        // récupération du mot de passe version hash avant stockage en BD
        const password_hash = await passwordUtils.hashPassword(password);

        const user = await userModel.create({
            email,
            password_hash,
            username,
            bio,
            city
        });

        const token = jwtUtils.generateToken(user.id);

        return res.status(201).json({
            success: true,
            token,
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

/**
 * Connexion à un compte existant via l'email et le mot de passe
 * @Condition : un utilisateur avec cet email doit exister et le mot de passe doit être valide
 */
async function loginUser(req, res) {
    try {
        const {email, password} = req.body;

        // recherche d'un utilisateur contenant l'email envoyé depuis le front
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

        return res.status(201).json({
            success: true,
            token,
            data : {
                id : userExistant.id,
                email : userExistant.email,
                username : userExistant.username,
                bio : userExistant.bio,
                city : userExistant.city
            }
        });

    } catch (error) {
        res.status(400).json(error);
    }
}

async function logoutUser(req, res) {
    try{
        return res.status(201).json({
            success: true,
            data : {
                message: "Utilisateur déconnecté avec succès"
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
    registerUser,
    loginUser,
    logoutUser
};