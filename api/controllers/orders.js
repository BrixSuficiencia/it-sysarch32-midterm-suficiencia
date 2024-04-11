const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name') /* gets product data  of id and name*/
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
    /* handling GET request */
}

exports.orders_create = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product not Found',
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'localhost:3000/orders/' + result._id
                    }
                });
            });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product') /* gets all product data */
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order not Found'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'localhost:3000/orders/'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId;
    console.log('Deleting order with ID:', id);
    Order.deleteOne({_id: id }) // Corrected to delete from Order collection
    .exec()
    .then(result => {
        console.log('Deletion result:', result);
        if(result.deletedCount > 0) {
            res.status(200).json({ 
                message: 'Order deleted', 
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            });
        } else {
            res.status(404).json({ message: 'No valid entry found for provided ID' });
        }
    })
    .catch(err => {
        console.log('Deletion error:', err);
        res.status(500).json({
            error: err
        });
    });
}