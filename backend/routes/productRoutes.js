const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/popular', productController.getPopularProducts);
router.get('/favorites', auth, productController.getFavorites);
router.get('/:id', productController.getProductById);
router.post('/:id/favorite', auth, productController.toggleFavorite);

module.exports = router;
