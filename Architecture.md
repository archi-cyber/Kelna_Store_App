# Kelna Store App — Architecture Complète

## 1. Vue d'ensemble du projet

**Kelna Store** est une application mobile cross-platform (iOS & Android) développée avec **React Native + Expo**, permettant aux utilisateurs de découvrir, personnaliser et commander des surprises cadeaux avec l'assistance d'une IA.

---

## 2. Stack Technologique

### Frontend (Mobile)
| Technologie | Rôle |
|---|---|
| React Native + Expo | Framework cross-platform |
| React Navigation v6 | Navigation (Stack + Tab) |
| Context API + useReducer | Gestion d'état global |
| Axios | Communication API REST |
| Expo Image Picker | Caméra & galerie |
| Firebase SDK | Chat temps réel & notifications push |
| AsyncStorage | Persistance locale (panier, token) |

### Backend (API REST)
| Technologie | Rôle |
|---|---|
| Node.js + Express | Serveur API |
| MySQL + mysql2 | Base de données relationnelle |
| JWT (jsonwebtoken) | Authentification |
| bcryptjs | Hashage des mots de passe |
| Firebase Admin SDK | Notifications push |
| OpenAI API | Assistant IA conversationnel |
| Stripe | Paiement sécurisé |
| multer | Upload d'images |
| cors, dotenv | Configuration & sécurité |

---

## 3. Arborescence du projet

```
kelna-store/
├── App.js                          # Point d'entrée Expo
├── app.json                        # Configuration Expo
├── package.json                    # Dépendances frontend
├── babel.config.js                 # Configuration Babel
├── .env                            # Variables d'environnement frontend
│
├── src/
│   ├── config/
│   │   ├── api.js                  # Configuration Axios
│   │   ├── firebase.js             # Configuration Firebase
│   │   └── theme.js                # Thème (couleurs, polices, styles)
│   │
│   ├── context/
│   │   ├── AuthContext.js          # Contexte d'authentification
│   │   └── CartContext.js          # Contexte du panier
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js         # Navigateur principal
│   │   ├── AuthNavigator.js        # Navigation auth (Login/Register)
│   │   └── TabNavigator.js         # Navigation par onglets
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js      # Écran de connexion
│   │   │   └── RegisterScreen.js   # Écran d'inscription
│   │   │
│   │   ├── HomeScreen.js           # Accueil / Découverte
│   │   ├── CatalogScreen.js        # Catalogue avec filtres
│   │   ├── ProductDetailScreen.js  # Détail d'un produit
│   │   ├── CartScreen.js           # Panier et paiement
│   │   ├── ChatAIScreen.js         # Chat avec l'IA
│   │   ├── ChatScreen.js           # Messagerie temps réel
│   │   ├── ProfileScreen.js        # Profil utilisateur
│   │   └── NotificationsScreen.js  # Notifications
│   │
│   ├── components/
│   │   ├── ProductCard.js          # Carte produit réutilisable
│   │   ├── CategoryChip.js         # Bouton catégorie
│   │   ├── ChatBubble.js           # Bulle de chat
│   │   ├── FilterBar.js            # Barre de filtres
│   │   ├── SearchBar.js            # Barre de recherche
│   │   ├── CartItem.js             # Item dans le panier
│   │   ├── NotificationItem.js     # Item notification
│   │   └── LoadingSpinner.js       # Indicateur de chargement
│   │
│   ├── services/
│   │   ├── authService.js          # Appels API authentification
│   │   ├── productService.js       # Appels API produits
│   │   ├── cartService.js          # Logique panier
│   │   ├── aiService.js            # Appels OpenAI
│   │   ├── chatService.js          # Service Firebase Chat
│   │   └── notificationService.js  # Service notifications
│   │
│   └── utils/
│       ├── helpers.js              # Fonctions utilitaires
│       └── validators.js           # Validation des formulaires
│
├── backend/
│   ├── server.js                   # Point d'entrée serveur
│   ├── package.json                # Dépendances backend
│   ├── .env                        # Variables d'environnement backend
│   │
│   ├── config/
│   │   ├── db.js                   # Connexion MySQL
│   │   └── firebase-admin.js       # Firebase Admin SDK
│   │
│   ├── middleware/
│   │   ├── auth.js                 # Middleware JWT
│   │   └── upload.js               # Middleware upload images
│   │
│   ├── models/
│   │   └── database.sql            # Script de création BDD
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # Routes authentification
│   │   ├── productRoutes.js        # Routes produits
│   │   ├── orderRoutes.js          # Routes commandes
│   │   ├── aiRoutes.js             # Routes IA
│   │   └── chatRoutes.js           # Routes chat
│   │
│   └── controllers/
│       ├── authController.js       # Logique auth
│       ├── productController.js    # Logique produits
│       ├── orderController.js      # Logique commandes
│       └── aiController.js         # Logique IA
│
└── assets/
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

---

## 4. Modèle de données (MySQL)

### Table `users`
| Colonne | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT PK | Identifiant unique |
| username | VARCHAR(100) | Nom d'utilisateur |
| email | VARCHAR(255) UNIQUE | Email |
| password | VARCHAR(255) | Mot de passe hashé |
| avatar_url | VARCHAR(500) | Photo de profil |
| push_token | VARCHAR(500) | Token FCM |
| created_at | TIMESTAMP | Date de création |

### Table `products`
| Colonne | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT PK | Identifiant unique |
| name | VARCHAR(255) | Nom du produit |
| description | TEXT | Description |
| price | DECIMAL(10,2) | Prix |
| category | VARCHAR(100) | Catégorie |
| image_url | VARCHAR(500) | URL image |
| rating | DECIMAL(2,1) | Note moyenne |
| occasion | VARCHAR(100) | Occasion (anniversaire, etc.) |
| is_popular | BOOLEAN | Produit populaire |
| created_at | TIMESTAMP | Date de création |

### Table `orders`
| Colonne | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT PK | Identifiant unique |
| user_id | INT FK → users.id | Utilisateur |
| total | DECIMAL(10,2) | Montant total |
| status | ENUM | Statut (pending, confirmed, shipped, delivered) |
| shipping_address | TEXT | Adresse de livraison |
| created_at | TIMESTAMP | Date de création |

### Table `order_items`
| Colonne | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT PK | Identifiant unique |
| order_id | INT FK → orders.id | Commande |
| product_id | INT FK → products.id | Produit |
| quantity | INT | Quantité |
| price | DECIMAL(10,2) | Prix unitaire |

### Table `favorites`
| Colonne | Type | Description |
|---|---|---|
| id | INT AUTO_INCREMENT PK | Identifiant unique |
| user_id | INT FK → users.id | Utilisateur |
| product_id | INT FK → products.id | Produit |

---

## 5. API Endpoints

### Authentification
| Méthode | Route | Description |
|---|---|---|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET | /api/auth/profile | Profil (protégé) |
| PUT | /api/auth/profile | Modifier profil |

### Produits
| Méthode | Route | Description |
|---|---|---|
| GET | /api/products | Liste des produits (filtres) |
| GET | /api/products/:id | Détail d'un produit |
| GET | /api/products/categories | Liste des catégories |
| GET | /api/products/popular | Produits populaires |

### Commandes
| Méthode | Route | Description |
|---|---|---|
| POST | /api/orders | Créer une commande |
| GET | /api/orders | Historique commandes |
| GET | /api/orders/:id | Détail d'une commande |

### IA
| Méthode | Route | Description |
|---|---|---|
| POST | /api/ai/chat | Envoyer un message à l'IA |
| POST | /api/ai/suggest | Suggestions de cadeaux |

---

## 6. Diagramme de navigation

```
App
├── AuthNavigator (si non connecté)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── TabNavigator (si connecté)
    ├── Tab: Accueil
    │   └── HomeScreen → ProductDetailScreen
    ├── Tab: Découvrir
    │   └── CatalogScreen → ProductDetailScreen
    ├── Tab: Panier
    │   └── CartScreen
    └── Tab: Profil
        ├── ProfileScreen
        ├── NotificationsScreen
        └── ChatAIScreen (accessible via FAB)
```

---

## 7. Instructions d'installation

### Prérequis
- Node.js v18+
- npm ou yarn
- Expo CLI
- MySQL 8.0+
- Android Studio (émulateur) ou appareil physique
- Compte Firebase (pour chat & notifications)
- Clé API OpenAI
- Compte Stripe (pour paiements)

### Installation Frontend
```bash
cd kelna-store
npm install
npx expo start
```

### Installation Backend
```bash
cd kelna-store/backend
npm install
# Configurer le fichier .env
# Importer database.sql dans MySQL
node server.js
```

---

## 8. Variables d'environnement

### Frontend (.env)
```
API_URL=http://192.168.x.x:3000/api
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
FIREBASE_PROJECT_ID=xxx
OPENAI_API_KEY=xxx
```

### Backend (.env)
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=xxx
DB_NAME=kelna_store
JWT_SECRET=xxx
OPENAI_API_KEY=xxx
STRIPE_SECRET_KEY=xxx
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
```
