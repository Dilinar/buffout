// The routes are responsible for handling the incoming requests and forwarding them to the controller.

/* Libraries */
const express = require('express');
const { check } = require('express-validator');

/* Application files */
const productsController = require('../controllers/products-controller');

const router = express.Router();

router.get('/:uid', productsController.getProductsByUserId);

router.post('/create', 
    [
        check('name').not().isEmpty(),
        check('protein').not().isEmpty(),
        check('price').not().isEmpty(),
    ],
    productsController.createProduct);

router.patch('/:pid', 
    [
        check('name').not().isEmpty(),
        check('protein').not().isEmpty(),
        check('price').not().isEmpty(),
    ],
    productsController.updateProduct);

router.delete('/:pid', productsController.deleteProduct);

module.exports = router;
