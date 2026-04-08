# Kelna Store App — Guide d'installation complet

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Logiciels obligatoires
- **Node.js** v18+ → https://nodejs.org
- **npm** (inclus avec Node.js)
- **MySQL** 8.0+ → https://dev.mysql.com/downloads/
- **Visual Studio Code** → https://code.visualstudio.com
- **Git** → https://git-scm.com

### Pour le mobile
- **Expo Go** (application mobile) → Télécharger sur App Store / Google Play
- **Android Studio** (optionnel, pour émulateur) → https://developer.android.com/studio

### Comptes nécessaires
- **Firebase** → https://console.firebase.google.com (gratuit)
- **OpenAI** → https://platform.openai.com (clé API nécessaire)
- **Stripe** → https://stripe.com (compte test gratuit)

---

## 🚀 Étape 1 — Installation des outils globaux

Ouvrez un terminal et exécutez :

```bash
# Installer Expo CLI globalement
npm install -g expo-cli

# Installer nodemon pour le développement backend
npm install -g nodemon

# Vérifier les versions
node --version    # doit afficher v18.x ou supérieur
npm --version     # doit afficher v9.x ou supérieur
```

---

## 📦 Étape 2 — Installation du projet Frontend (React Native)

```bash
# Se placer dans le dossier du projet
cd kelna-store

# Installer toutes les dépendances
npm install

# Si vous avez des erreurs, essayez :
npm install --legacy-peer-deps
```

### Dépendances qui seront installées :
| Package | Version | Rôle |
|---|---|---|
| expo | ~52.0.0 | Framework React Native |
| react-native | 0.76.3 | Core mobile |
| @react-navigation/native | ^6.1.9 | Navigation |
| @react-navigation/native-stack | ^6.9.17 | Navigation stack |
| @react-navigation/bottom-tabs | ^6.5.11 | Navigation onglets |
| axios | ^1.6.2 | Appels HTTP |
| @react-native-async-storage/async-storage | 1.23.1 | Stockage local |
| expo-image-picker | ~16.0.0 | Caméra/Galerie |
| expo-notifications | ~0.29.0 | Notifications push |
| @expo/vector-icons | ^14.0.0 | Icônes |
| react-native-gesture-handler | ~2.20.2 | Gestes |
| react-native-reanimated | ~3.16.1 | Animations |
| react-native-safe-area-context | 4.12.0 | Safe area |
| react-native-screens | ~4.1.0 | Navigation native |

---

## 📦 Étape 3 — Installation du Backend (Node.js + Express)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Retourner à la racine
cd ..
```

### Dépendances backend :
| Package | Rôle |
|---|---|
| express | Serveur web |
| mysql2 | Connexion MySQL |
| cors | Cross-Origin Resource Sharing |
| dotenv | Variables d'environnement |
| jsonwebtoken | Authentification JWT |
| bcryptjs | Hashage mots de passe |
| multer | Upload fichiers |
| openai | API OpenAI |
| stripe | Paiements |
| firebase-admin | Notifications push |

---

## 🗄️ Étape 4 — Configuration de la base de données MySQL

### 4.1 Créer la base de données

Ouvrez MySQL Workbench (ou terminal MySQL) :

```bash
# Se connecter à MySQL
mysql -u root -p
```

### 4.2 Exécuter le script SQL

```sql
-- Copier-coller le contenu de backend/models/database.sql
-- ou exécuter depuis le terminal :
source /chemin/vers/kelna-store/backend/models/database.sql;
```

Ou depuis le terminal directement :
```bash
mysql -u root -p < backend/models/database.sql
```

### 4.3 Vérifier

```sql
USE kelna_store;
SHOW TABLES;
SELECT COUNT(*) FROM products;  -- Doit retourner 15
SELECT COUNT(*) FROM categories; -- Doit retourner 8
```

---

## 🔑 Étape 5 — Configuration des variables d'environnement

### 5.1 Backend (.env)

Modifier le fichier `backend/.env` :

```env
PORT=3000

# MySQL - Adaptez selon votre configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=VOTRE_MOT_DE_PASSE_MYSQL
DB_NAME=kelna_store

# JWT - Changez cette clé !
JWT_SECRET=une_cle_secrete_tres_longue_et_aleatoire_123456

# OpenAI - Votre clé API
OPENAI_API_KEY=sk-votre-cle-openai

# Stripe - Clé test
STRIPE_SECRET_KEY=sk_test_votre-cle-stripe
```

### 5.2 Frontend (src/config/api.js)

Modifier l'adresse IP du serveur dans `src/config/api.js` :

```javascript
// Trouvez votre IP locale :
// Windows : ipconfig (chercher IPv4)
// Mac : ifconfig | grep inet
// Linux : ip addr

const API_URL = 'http://VOTRE_IP_LOCALE:3000/api';
// Exemple : 'http://192.168.1.100:3000/api'
```

---

## 🔥 Étape 6 — Configuration Firebase (Chat + Notifications)

### 6.1 Créer un projet Firebase

1. Allez sur https://console.firebase.google.com
2. Cliquez "Ajouter un projet"
3. Nommez-le "kelna-store"
4. Activez Firestore Database
5. Activez Cloud Messaging

### 6.2 Obtenir la configuration

1. Paramètres du projet → Général
2. Ajoutez une application Web
3. Copiez les clés dans `src/config/firebase.js`

### 6.3 Pour le backend (Service Account)

1. Paramètres du projet → Comptes de service
2. Générer une nouvelle clé privée (JSON)
3. Sauvegarder le fichier dans `backend/firebase-service-account.json`

---

## 🤖 Étape 7 — Configuration OpenAI

1. Allez sur https://platform.openai.com/api-keys
2. Créez une nouvelle clé API
3. Collez-la dans `backend/.env` → `OPENAI_API_KEY`

**Note** : L'API OpenAI est payante mais le coût est faible (~0.002$/message avec GPT-3.5).

---

## 🚀 Étape 8 — Lancer le projet

### 8.1 Démarrer le backend

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Vous devriez voir :
# 🚀 Serveur Kelna Store démarré sur le port 3000
# ✅ Connecté à MySQL - Base de données: kelna_store
```

Tester : http://localhost:3000 dans votre navigateur.

### 8.2 Démarrer le frontend

```bash
# Terminal 2 - Frontend (nouveau terminal)
cd kelna-store
npx expo start
```

### 8.3 Ouvrir l'application

- **Sur mobile** : Scannez le QR code avec l'app Expo Go
- **Émulateur Android** : Appuyez sur `a` dans le terminal
- **Émulateur iOS** : Appuyez sur `i` dans le terminal (Mac uniquement)

---

## 🧪 Étape 9 — Tester l'API avec Postman

### Inscription
```
POST http://localhost:3000/api/auth/register
Body (JSON):
{
  "username": "TestUser",
  "email": "test@example.com",
  "password": "123456"
}
```

### Connexion
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Produits
```
GET http://localhost:3000/api/products
GET http://localhost:3000/api/products/popular
GET http://localhost:3000/api/products/categories
GET http://localhost:3000/api/products?category=Tech&sort=price_asc
```

### Chat IA (nécessite token JWT)
```
POST http://localhost:3000/api/ai/chat
Headers: Authorization: Bearer VOTRE_TOKEN
Body (JSON):
{
  "message": "Je cherche un cadeau pour un ami de 25 ans qui aime la tech"
}
```

---

## 📱 Structure des écrans

| Écran | Fichier | Description |
|---|---|---|
| Connexion | `screens/auth/LoginScreen.js` | Authentification |
| Inscription | `screens/auth/RegisterScreen.js` | Création de compte |
| Accueil | `screens/HomeScreen.js` | Page principale, catégories, populaires |
| Catalogue | `screens/CatalogScreen.js` | Tous les produits avec filtres |
| Détail produit | `screens/ProductDetailScreen.js` | Fiche produit complète |
| Panier | `screens/CartScreen.js` | Gestion du panier + checkout |
| Chat IA | `screens/ChatAIScreen.js` | Assistant IA conversationnel |
| Profil | `screens/ProfileScreen.js` | Profil utilisateur + menu |
| Notifications | `screens/NotificationsScreen.js` | Centre de notifications |

---

## 🐛 Résolution des problèmes courants

### "Network Error" ou "Unable to connect"
- Vérifiez que le backend tourne (`npm run dev`)
- Vérifiez l'adresse IP dans `src/config/api.js`
- Assurez-vous que le téléphone et l'ordinateur sont sur le même WiFi
- Vérifiez le pare-feu Windows (autoriser Node.js)

### "Cannot connect to MySQL"
- Vérifiez que MySQL tourne
- Vérifiez les identifiants dans `backend/.env`
- Testez la connexion : `mysql -u root -p`

### Erreur Expo
```bash
# Nettoyer le cache
npx expo start -c

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### L'IA ne répond pas
- Vérifiez la clé API OpenAI dans `backend/.env`
- Vérifiez que vous avez des crédits sur votre compte OpenAI

---

## 📂 Commandes utiles

```bash
# Frontend
npx expo start          # Démarrer Expo
npx expo start -c       # Démarrer avec cache propre
npx expo start --android # Démarrer sur Android
npx expo start --ios     # Démarrer sur iOS

# Backend
cd backend
npm run dev             # Démarrer avec nodemon (auto-reload)
npm start               # Démarrer sans auto-reload

# Base de données
mysql -u root -p < backend/models/database.sql  # Réinitialiser la BDD
```

---

## 👨‍💻 Auteur

**Junior Dokmegho Tefo**
Projet intégrateur — 420-0SY-OQ
Professeur : Mohamed Ben Ghachem