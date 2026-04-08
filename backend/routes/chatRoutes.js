const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Toutes les routes sont protégées par JWT
router.get('/conversations', auth, chatController.getConversations);
router.get('/unread-count', auth, chatController.getUnreadCount);
router.get('/conversations/:conversationId/messages', auth, chatController.getMessages);
router.post('/messages', auth, chatController.sendMessage);
router.delete('/conversations/:conversationId', auth, chatController.deleteConversation);

module.exports = router;