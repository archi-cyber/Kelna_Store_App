-- ============================================
-- Kelna Store App - Base de données MySQL
-- ============================================

CREATE DATABASE IF NOT EXISTS kelna_store;
USE kelna_store;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    push_token VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    color VARCHAR(7) DEFAULT '#6A35FF'
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    image_url VARCHAR(500),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    occasion VARCHAR(100) DEFAULT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    stock INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_intent_id VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des items de commande
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, product_id)
);

-- Table des messages (historique chat IA)
CREATE TABLE IF NOT EXISTS ai_chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Données initiales
-- ============================================

-- Catégories
INSERT INTO categories (name, icon, color) VALUES
('Fleurs', 'flower', '#FF6B8B'),
('Tech', 'laptop', '#4A90D9'),
('Expériences', 'star', '#FFB347'),
('Personnalisé', 'heart', '#FF6B8B'),
('Luxe', 'diamond', '#9B59B6'),
('Écologique', 'leaf', '#27AE60'),
('Cartes cadeaux', 'gift', '#E74C3C'),
('Électroménager', 'home', '#3498DB');

-- Table des conversations
CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conversation (user1_id, user2_id)
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id, created_at)
);

-- Produits de démonstration
INSERT INTO products (name, description, price, category_id, image_url, rating, occasion, is_popular) VALUES
('Bouquet Premium', 'Magnifique bouquet de roses rouges, livraison incluse. Idéal pour exprimer vos sentiments.', 65.00, 1, 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400', 4.8, 'Anniversaire', TRUE),
('Montre Connectée', 'Smartwatch avec suivi d''activité, notifications et design élégant.', 89.00, 2, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 4.5, 'Anniversaire', TRUE),
('Atelier Cuisine', 'Expérience culinaire pour 2 personnes avec un chef étoilé.', 75.00, 3, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', 4.9, 'Saint-Valentin', TRUE),
('Casque Gaming Sans Fil', 'Casque audio haut de gamme pour gaming avec micro intégré.', 120.00, 2, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', 4.7, 'Noël', TRUE),
('Coffret SPA Relaxation', 'Coffret complet de soins SPA à domicile avec huiles essentielles.', 55.00, 3, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', 4.6, 'Fête des mères', FALSE),
('Cadre Photo Personnalisé', 'Cadre en bois gravé avec votre photo et message personnalisé.', 35.00, 4, 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400', 4.4, 'Anniversaire', FALSE),
('Mug Personnalisé', 'Mug en céramique avec impression photo HD de votre choix.', 19.99, 4, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', 4.3, 'Noël', FALSE),
('Bougie Artisanale', 'Bougie parfumée en cire de soja, faite main. Parfum lavande.', 28.00, 6, 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400', 4.5, 'Fête des mères', FALSE),
('Enceinte Bluetooth', 'Enceinte portable waterproof avec son 360°.', 79.00, 2, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 4.6, 'Noël', TRUE),
('Carte Cadeau 50€', 'Carte cadeau utilisable sur tout le catalogue Kelna Store.', 50.00, 7, 'https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400', 5.0, 'Toute occasion', TRUE),
('Abonnement Streaming', 'Abonnement de 6 mois à un service de streaming premium.', 59.99, 2, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400', 4.2, 'Noël', FALSE),
('Kit Jardinage Bio', 'Kit complet pour démarrer un potager bio sur balcon.', 42.00, 6, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 4.7, 'Fête des mères', FALSE),
('Parfum de Luxe', 'Eau de parfum 100ml dans un flacon élégant.', 95.00, 5, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 4.8, 'Saint-Valentin', TRUE),
('Chocolats Artisanaux', 'Coffret de 24 chocolats fins faits main par un maître chocolatier.', 45.00, 5, 'https://images.unsplash.com/photo-1549007994-cb92caefdbe?w=400', 4.9, 'Saint-Valentin', FALSE),
('Sac en Cuir', 'Sac à main en cuir véritable, design moderne et intemporel.', 149.00, 5, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', 4.5, 'Anniversaire', FALSE);
