const express = require('express');
const router = express.Router();
/* Setup Express router */
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);
/* route get method */

router.post('/', checkAuth, OrdersController.orders_create);
/* route create method */

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);
/* Get information on a single Order */

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);
/* Delete a single Order */

module.exports = router;
/* to Export the Routes */