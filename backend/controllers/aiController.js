const OpenAI = require('openai');
const db = require('../config/db');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `Tu es l'assistant IA de Kelna Store, une application de cadeaux et surprises. 
Tu aides les utilisateurs à trouver le cadeau parfait en posant des questions sur :
- L'occasion (anniversaire, Noël, Saint-Valentin, fête des mères, etc.)
- Le destinataire (âge, sexe, relation, centres d'intérêt)
- Le budget
- Les préférences (tech, fleurs, expériences, personnalisé, luxe, écologique)

Tu dois être chaleureux, enthousiaste et créatif dans tes suggestions.
Propose toujours des produits concrets avec des prix approximatifs.
Réponds en français. Sois concis mais utile.`;

// Chat avec l'IA
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: 'Message requis.' });
    }

    // Récupérer l'historique récent
    const [history] = await db.query(
      'SELECT role, message FROM ai_chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    // Construire les messages pour OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.reverse().map(h => ({ role: h.role, content: h.message })),
      { role: 'user', content: message }
    ];

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.8
    });

    const aiResponse = completion.choices[0].message.content;

    // Sauvegarder dans l'historique
    await db.query(
      'INSERT INTO ai_chat_history (user_id, role, message) VALUES (?, ?, ?)',
      [userId, 'user', message]
    );
    await db.query(
      'INSERT INTO ai_chat_history (user_id, role, message) VALUES (?, ?, ?)',
      [userId, 'assistant', aiResponse]
    );

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Erreur IA:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la communication avec l\'IA.',
      response: 'Désolé, je rencontre un problème technique. Puis-je vous aider autrement ? Parcourez notre catalogue pour découvrir nos surprises !'
    });
  }
};

// Suggestions rapides basées sur des critères
exports.suggest = async (req, res) => {
  try {
    const { occasion, budget, category } = req.body;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (occasion) {
      query += ' AND p.occasion = ?';
      params.push(occasion);
    }
    if (budget) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(budget));
    }
    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }

    query += ' ORDER BY p.rating DESC LIMIT 5';

    const [products] = await db.query(query, params);

    res.json({
      suggestions: products,
      message: `Voici ${products.length} suggestions pour vous !`
    });
  } catch (error) {
    console.error('Erreur suggestions:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir l'historique du chat
exports.getChatHistory = async (req, res) => {
  try {
    const [history] = await db.query(
      'SELECT role, message, created_at FROM ai_chat_history WHERE user_id = ? ORDER BY created_at ASC',
      [req.user.id]
    );
    res.json({ history });
  } catch (error) {
    console.error('Erreur historique chat:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
