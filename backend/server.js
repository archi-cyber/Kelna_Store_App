// backend/server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


// En haut avec les autres imports de routes
const chatRoutes = require('./routes/chatRoutes');

// Avec les autres app.use
app.use('/api/chat', chatRoutes);

// Middleware pour parser le JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});