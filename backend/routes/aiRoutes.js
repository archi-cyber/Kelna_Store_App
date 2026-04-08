const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/chat', auth, aiController.chat);
router.post('/suggest', auth, aiController.suggest);
router.get('/history', auth, aiController.getChatHistory);

module.exports = router;
