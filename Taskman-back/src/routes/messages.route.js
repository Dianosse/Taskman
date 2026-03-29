const messagesControllers = require('../controllers/messages.controllers');

const router = require('express').Router();

router.route("/").post(messagesControllers.addMessage);

module.exports = router;