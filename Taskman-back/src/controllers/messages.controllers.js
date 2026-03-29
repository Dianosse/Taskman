const messageModels = require('../models/messages');
const conversationModels = require('../models/conversations');
const userModels = require('../models/users');
const jwt = require("jsonwebtoken");

async function addMessage(req, res) {
    try {
        let token_decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);

        let id_user = token_decoded.userId;

        const user = await userModels.findByPk(id_user);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'L\'utilisateur n\'existe pas'
            });
        }

        const {id_conversation, content} = req.body;

        const conversation = await conversationModels.findByPk(id_conversation);

        if(!conversation) {
            return res.status(401).json({
                success: false,
                error: 'La conversation n\'existe pas'
            });
        }

        console.log(id_user, conversation.id_user1, conversation.id_user2)

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
    addMessage
};