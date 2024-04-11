const express = require('express');
const app = express();
/* Executes express as a Function */
const morgan = require('morgan');
/* Funnel request through morgan */
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
/* Mongoose import */

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));
/* lets the request continue */
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/* extracts data and make it readable */

mongoose.connect(
    'mongodb+srv://node-shop:' + 
    process.env.MONGO_ATLAS_PW + 
    '@node-rest-shop.pvorgl3.mongodb.net/'
).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    // You might want to gracefully handle this error, perhaps by stopping the server
    process.exit(1);
});
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
    next();
});
/* gives access */

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
/* Use sets up as a middleware */

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
/* Error Handling */

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
/* Error Handling */

module.exports = app;