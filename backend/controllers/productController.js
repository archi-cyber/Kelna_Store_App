const db = require('../config/db');

// Obtenir tous les produits (avec filtres optionnels)
exports.getProducts = async (req, res) => {
  try {
    const { category, occasion, min_price, max_price, sort, search } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }
    if (occasion) {
      query += ' AND p.occasion = ?';
      params.push(occasion);
    }
    if (min_price) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(max_price));
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Tri
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.rating DESC';
        break;
      case 'popular':
        query += ' ORDER BY p.is_popular DESC, p.rating DESC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    const [products] = await db.query(query, params);
    res.json({ products });
  } catch (error) {
    console.error('Erreur produits:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Erreur produit:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir les catégories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json({ categories });
  } catch (error) {
    console.error('Erreur catégories:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir les produits populaires
exports.getPopularProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.is_popular = TRUE 
       ORDER BY p.rating DESC 
       LIMIT 10`
    );
    res.json({ products });
  } catch (error) {
    console.error('Erreur produits populaires:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Ajouter/retirer des favoris
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const [existing] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
      res.json({ message: 'Retiré des favoris.', isFavorite: false });
    } else {
      await db.query('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      res.json({ message: 'Ajouté aux favoris.', isFavorite: true });
    }
  } catch (error) {
    console.error('Erreur favoris:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir les favoris
exports.getFavorites = async (req, res) => {
  try {
    const [favorites] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM favorites f 
       JOIN products p ON f.product_id = p.id 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE f.user_id = ? 
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json({ products: favorites });
  } catch (error) {
    console.error('Erreur favoris:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
