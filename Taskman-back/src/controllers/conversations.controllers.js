const conversationModels = require('../models/conversations');
const annonceModels = require('../models/annonces');
const usersModels = require('../models/users');
const messageModels = require('../models/messages');
const { Op } = require('sequelize');

async function getMyConversations(req, res) {
    try{
        const id_creator = req.user.id;

        const allMyConversation = await conversationModels.findAll({
            where : {
                [Op.or]: [{id_user1 : id_creator}, {id_user2: id_creator}]
            }
        });

        res.json({
            success:true,
            data : {
                allMyConversation
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

async function createConversation(req, res) {
    try {
        const id_user1 = req.user.id;

        const {id_user2, id_annonce} = req.body;

        const autre_user = await usersModels.findByPk(id_user2);
        const annonce = await annonceModels.findByPk(id_annonce);

        if (!autre_user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }
        if(!annonce) {
            return res.status(401).json({
                success: false,
                error: 'L\'annonce n\'existe pas'
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
                    {id_user1, id_user2_int}, {id_user1: id_user2_int, id_user2: id_user1}
                ]
            }
        });
        if (conv) {
            return res.status(403).json({
                success: false,
                error: 'Une conversation existe déjà pour ces deux utilisateurs pour cette annonce'
            });
        }

        const conversation = await conversationModels.create({
            id_annonce,
            id_user1,
            id_user2 : id_user2_int
        });

        res.json({
            success: true,
            data : {
                conversation
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}


async function getMessageFromConversation(req, res) {
    try {
        const id_conversation = req.params.id;
        const conversation = await conversationModels.findByPk(id_conversation);

        if(!conversation) {
            return res.status(401).json({
                success: false,
                error: 'La conversation n\'existe pas'
            });
        }

        if (!(req.user.id === conversation.id_user1 || req.user.id === conversation.id_user2)) {
            return res.status(403).json({
                success: false,
                error: 'L\'utilisateur connecté ne fait pas parti de cette conversation'
            });
        }

        const allMessages = await messageModels.findAll({
            where : {
                id_conversation : id_conversation
            },
            order : [
                ["created_at", "ASC"]
            ]
        });

        res.json({
           success: true,
           data : {
               allMessages
           }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

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

        if(!conversation) {
            return res.status(401).json({
                success: false,
                error: 'La conversation n\'existe pas'
            });
        }

        if(!(id_user === conversation.id_user1 || id_user === conversation.id_user2)) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur ne fait pas parti de cette conversation'
            });
        }

        const message = await messageModels.create({
            id_conversation,
            id_user,
            content
        });

        res.json({
            success: true,
            data : {
                message
            }
        });

    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    getMyConversations,
    createConversation,
    getMessageFromConversation,
    sendMessage
};