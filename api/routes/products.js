const express = require('express');
const router = express.Router();
/* Setup Express router */
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    /* Reject a File */
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);
/* Get all Product method */

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);
/* Create new Product method */

router.get('/:productId', ProductsController.products_get_product);
/* Get information on a single Product */

router.patch('/:productId', checkAuth, ProductsController.products_update_product);
/* patch/update Product */

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);
/* delete Product */

module.exports = router;
/* to Export the Routes */