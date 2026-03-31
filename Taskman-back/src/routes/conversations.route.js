const conversationControllers = require('../controllers/conversations.controllers');

const router = require('express').Router();

router.route("/").get(conversationControllers.getMyConversations)
    .post(conversationControllers.createConversation);

router.route("/:id/messages").get(conversationControllers.getMessageFromConversation)
    .post(conversationControllers.sendMessage);

module.exports = router;