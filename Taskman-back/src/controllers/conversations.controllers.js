const conversationModels = require('../models/conversations');
const usersModels = require("../models/users");
const annonceModels = require('../models/annonces');
const messageModels = require('../models/messages');
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

async function getMyConversations(req, res) {
    try{
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const id_creator = token_decoded.userId;

        const user = await usersModels.findByPk(id_creator);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

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
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        const id_user1 = token_decoded.userId;

        const user = await usersModels.findByPk(id_user1);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

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

        const conversation = await conversationModels.create({
            id_annonce,
            id_user1,
            id_user2
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

        const allMessages = await messageModels.findAll({
            where : {
                id_conversation : id_conversation
            }
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

module.exports = {
    getMyConversations,
    createConversation,
    getMessageFromConversation
};