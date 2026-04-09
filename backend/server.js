// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialise la connexion MySQL (affiche le ✅ au démarrage)
require('./config/db');
require('./config/firebase-admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiRoutes = require('./routes/aiRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: '🎁 Bienvenue sur l\'API Kelna Store !',
    endpoints: ['/api/auth', '/api/products', '/api/orders', '/api/ai', '/api/chat'],
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée.' });
});

// Démarrer
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});