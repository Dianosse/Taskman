const jwt = require("jsonwebtoken");
const userModel = require('../models/users');


/**
 * Middleware qui permet la protection des routes.
 * Vérifie la présence d'un token JWT dans le header Authorization, contrôle sa validité puis récupère l'utilisateur connecté en base
 * @Conditions :
 *  - le token doit encore être valide
 *  - l'ID doit correspondre à un utilisateur existant
 */
async function protect(req, res, next) {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Non authentifié'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: err.name === 'TokenExpiredError'
                    ? 'Token expiré'
                    : 'Token invalide'
            });
        }

        const user = await userModel.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur introuvable'
            });
        }

        // permet de stocker l'utilisateur connecté pour qu'il puisse être utilisé facilement dans les fonctions qui suivent
        req.user = user;
        return next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
}

module.exports = protect;