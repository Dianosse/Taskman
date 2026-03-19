const jwt = require("jsonwebtoken");
const userModel = require('../models/users');


async function protect(req, res, next) {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if(authHeader?.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Vous devez être connecté pour accéder à cette ressource'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expiré, veuillez vous reconnecter'
                });
            }
            return res.status(401).json({
                success: false,
                error: 'Token invalide'
            });
        }


        const user = await userModel.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe plus'
            });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}


module.exports = protect;