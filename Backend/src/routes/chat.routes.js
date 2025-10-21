const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const { chatController, getChatsController, getMessagesController } = require('../Controllers/chat.controller');

router.post('/', auth, chatController);
router.get('/', auth, getChatsController);
router.get('/messages/:chatId', auth, getMessagesController);

module.exports = router;