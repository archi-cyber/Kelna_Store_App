const db = require('../config/db');

// Obtenir toutes les conversations de l'utilisateur connecté
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const [conversations] = await db.query(
      `SELECT 
        c.id,
        c.last_message,
        c.last_message_at,
        CASE 
          WHEN c.user1_id = ? THEN c.user2_id 
          ELSE c.user1_id 
        END as other_user_id,
        u.username as other_username,
        u.avatar_url as other_avatar,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.sender_id != ? 
         AND m.is_read = FALSE) as unread_count
       FROM conversations c
       JOIN users u ON u.id = (CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END)
       WHERE c.user1_id = ? OR c.user2_id = ?
       ORDER BY c.last_message_at DESC`,
      [userId, userId, userId, userId, userId]
    );

    res.json({ conversations });
  } catch (error) {
    console.error('Erreur conversations:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir les messages d'une conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Vérifier que l'utilisateur fait partie de la conversation
    const [conv] = await db.query(
      'SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [conversationId, userId, userId]
    );

    if (conv.length === 0) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    // Récupérer les messages
    const [messages] = await db.query(
      `SELECT m.*, u.username as sender_name, u.avatar_url as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at ASC`,
      [conversationId]
    );

    // Marquer comme lus les messages reçus
    await db.query(
      'UPDATE messages SET is_read = TRUE WHERE conversation_id = ? AND sender_id != ?',
      [conversationId, userId]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Erreur messages:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content, image_url } = req.body;
    const senderId = req.user.id;

    if (!receiver_id || !content) {
      return res.status(400).json({ message: 'Destinataire et contenu requis.' });
    }

    if (receiver_id === senderId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous envoyer un message à vous-même.' });
    }

    // Chercher ou créer la conversation (toujours user1_id < user2_id pour éviter les doublons)
    const user1 = Math.min(senderId, receiver_id);
    const user2 = Math.max(senderId, receiver_id);

    let [conv] = await db.query(
      'SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ?',
      [user1, user2]
    );

    let conversationId;
    if (conv.length === 0) {
      const [result] = await db.query(
        'INSERT INTO conversations (user1_id, user2_id, last_message) VALUES (?, ?, ?)',
        [user1, user2, content]
      );
      conversationId = result.insertId;
    } else {
      conversationId = conv[0].id;
    }

    // Insérer le message
    const [msgResult] = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, content, image_url) VALUES (?, ?, ?, ?)',
      [conversationId, senderId, content, image_url || null]
    );

    // Mettre à jour la conversation
    await db.query(
      'UPDATE conversations SET last_message = ?, last_message_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content, conversationId]
    );

    // Notification push (optionnelle, si firebase-admin est configuré)
    try {
      const { sendPushNotification } = require('../config/firebase-admin');
      const [receiverRows] = await db.query(
        'SELECT push_token FROM users WHERE id = ?',
        [receiver_id]
      );
      const [senderRows] = await db.query(
        'SELECT username FROM users WHERE id = ?',
        [senderId]
      );
      if (receiverRows[0]?.push_token) {
        await sendPushNotification(
          receiverRows[0].push_token,
          `Nouveau message de ${senderRows[0].username}`,
          content.substring(0, 100),
          { type: 'message', conversationId: String(conversationId) }
        );
      }
    } catch (e) {
      // Firebase non configuré, on ignore
    }

    res.status(201).json({
      message: 'Message envoyé.',
      data: {
        id: msgResult.insertId,
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        image_url,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const [result] = await db.query(
      'DELETE FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [conversationId, userId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conversation non trouvée.' });
    }

    res.json({ message: 'Conversation supprimée.' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Nombre total de messages non lus
exports.getUnreadCount = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM messages m
       JOIN conversations c ON m.conversation_id = c.id
       WHERE (c.user1_id = ? OR c.user2_id = ?)
       AND m.sender_id != ?
       AND m.is_read = FALSE`,
      [req.user.id, req.user.id, req.user.id]
    );

    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Erreur unread count:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};