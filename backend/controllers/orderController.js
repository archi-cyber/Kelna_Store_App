const db = require('../config/db');

// Créer une commande
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { items, shipping_address, total } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide.' });
    }

    if (!shipping_address) {
      return res.status(400).json({ message: 'Adresse de livraison requise.' });
    }

    // Créer la commande
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total, shipping_address, status) VALUES (?, ?, ?, ?)',
      [userId, total, shipping_address, 'confirmed']
    );

    const orderId = orderResult.insertId;

    // Ajouter les items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Décrémenter le stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.product_id, item.quantity]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Commande créée avec succès !',
      order: { id: orderId, total, status: 'confirmed' }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erreur commande:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  } finally {
    connection.release();
  }
};

// Historique des commandes
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name,
            'product_image', p.image_url
          )
        ) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    // Parser les items JSON
    const parsedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    res.json({ orders: parsedOrders });
  } catch (error) {
    console.error('Erreur historique:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Détail d'une commande
exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.* FROM orders o WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.image_url as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ order: { ...orders[0], items } });
  } catch (error) {
    console.error('Erreur détail commande:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
