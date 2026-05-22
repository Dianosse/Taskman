const conversationModels = require('../models/conversations');
const annonceModels = require('../models/annonces');
const usersModels = require('../models/users');
const messageModels = require('../models/messages');
const { Op } = require('sequelize');

/**
 * Retourne toutes les conversations qui ont comme participant l'utilisateur actuellement connecté
 */
async function getMyConversations(req, res) {
    try{
        const [allMyConversation] = await conversationModels.sequelize.query(
            `
            select conv.*, u1.username as username1, u1.email as email1, u2.username as username2, u2.email as email2, a.titre as titre_annonce
            from conversations conv
            INNER JOIN users u1 ON conv.id_user1 = u1.id
            INNER JOIN users u2 ON conv.id_user2 = u2.id
            INNER JOIN annonces a ON conv.id_annonce = a.id
            WHERE conv.id_user1 = :id_creator OR conv.id_user2 = :id_creator
            `,
            {
                replacements: {id_creator: req.user.id}
            }
        );

        return res.status(201).json({
            success:true,
            data : {
                allMyConversation
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
 * Créé une conversation entre l'utilisateur actuellement connecté et l'utilisateur dont l'ID est envoyé
 * @Conditions :
 *  - l'utilisateur dont l'ID est envoyé doit exister en BD
 *  - l'annonce relative à cette conversation doit exister
 *  - l'ID de l'utilisateur actuellement connecté et l'ID envoyé ne doivent pas être identiques (impossible de créer une conversation avec soi-même)
 *  - il ne doit pas déjà y avoir de conversation entre ces deux utilisateurs pour cette annonce
 */
async function createConversation(req, res) {
    try {
        const id_user1 = req.user.id;

        const {id_user2, id_annonce} = req.body;

        const autre_user = await usersModels.findByPk(id_user2);
        const annonce = await annonceModels.findByPk(id_annonce);

        if (!autre_user) {
            return res.status(404).json({
                success: false,
                error: "L'utilisateur n'existe pas"
            });
        }

        if (!annonce) {
            return res.status(404).json({
                success: false,
                error: "L'annonce n'existe pas"
            });
        }

        const id_user2_int = parseInt(id_user2);

        if (id_user1 === id_user2_int) {
            return res.status(400).json({
                success: false,
                error: 'Impossible de créer une conversation avec soi-même'
            });
        }

        const conv = await conversationModels.findOne({
            where: {
                id_annonce,
                [Op.or]: [
                    {id_user1 : id_user1, id_user2: id_user2_int}, {id_user1: id_user2_int, id_user2: id_user1}
                ]
            }
        });

        if (conv) {
            return res.status(409).json({
                success: false,
                data: { conv },
                error: "Une conversation existe déjà pour ces deux utilisateurs pour cette annonce"
            });
        }

        // permet de respecter le check BD "CK_Con_user_order"
        let id1;
        let id2;
        if (id_user1 > id_user2_int) {
            id1 = id_user2_int;
            id2 = id_user1;
        } else {
            id1 = id_user1;
            id2 = id_user2_int;
        }

        const conversation = await conversationModels.create({
            id_annonce,
            id_user1 : id1,
            id_user2 : id2
        });

        return res.status(201).json({
            success: true,
            data: {
                conversation
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
 * Retourne les messages d'une conversation dont l'ID est envoyé
 * @Conditions :
 *  - cette conversation doit exister
 *  - l'utilisateur actuellement connecté doit faire partie de cette conversation
 */
async function getMessageFromConversation(req, res) {
    try {
        const id_conversation = req.params.id;
        const conversation = await conversationModels.findByPk(id_conversation);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: "La conversation n'existe pas"
            });
        }

        if (!(req.user.id === conversation.id_user1 || req.user.id === conversation.id_user2)) {
            return res.status(403).json({
                success: false,
                error: 'L\'utilisateur connecté ne fait pas partie de cette conversation'
            });
        }

        // renvoie tous les messages de la conversation dans l'ordre croissant selon la date d'envoie des messages
        const allMessages = await messageModels.findAll({
            where : {
                id_conversation : id_conversation
            },
            order : [
                ["created_at", "ASC"]
            ]
        });

        return res.status(201).json({
           success: true,
           data : {
               allMessages
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
 * Réception et stockage en BD d'un message d'une conversation dont l'ID est envoyé.
 * Utilisation de WebSocket pour gérer la messagerie en temps réel.
 * @Conditions :
 *  - le message ne doit pas être vide
 *  - la conversation dont l'ID est envoyé doit exister en BD
 *  - l'utilisateur actuellement connecté doit fait parti de la conversation dont l'ID est envoyé
 */
async function sendMessage(req, res) {
    try {
        const id_user = req.user.id;

        const id_conversation = req.params.id;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Le message est vide ou n'existe pas"
            });
        }

        const conversation = await conversationModels.findByPk(id_conversation);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: "La conversation n'existe pas"
            });
        }

        if (!(id_user === conversation.id_user1 || id_user === conversation.id_user2)) {
            return res.status(403).json({
                success: false,
                error: "L'utilisateur ne fait pas partie de cette conversation"
            });
        }

        const message = await messageModels.create({
            id_conversation,
            id_user,
            content
        });

        // envoi du message au front
        const io = req.app.get('io');
        io.to(`conversation_${id_conversation}`).emit('new_message', message);

        return res.status(201).json({
            success: true,
            data: { message }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    getMyConversations,
    createConversation,
    getMessageFromConversation,
    sendMessage
};