'use strict';

//https://git.heroku.com/our-natural-beauty-server.git

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

const products = require('./api/products');
const categories = require('./api/categories');
const homePageSlides = require('./api/homePageSlides');
const menuLinks = require('./api/menuLinks');
let productCart = [];
let totalPrice = 0;
let id = 0;
let cartTimeout;

const app = express();
let db;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// const access = [
//     'https://our-natural-beauty.herokuapp.com',
//     'http://our-natural-beauty.herokuapp.com',
//     'http://localhost:3000'
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (access.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// };

app.get("/api/v1/products", (req, res) => {
    res.send(products);
});

app.get("/api/v1/categories", (req, res) => {
    res.send(categories);
});

app.get("/api/v1/homePageSlides", (req, res) => {
    res.send(homePageSlides)
});

app.get("/v1/menuLinks", (req, res) => {
    res.send(menuLinks)
});

app.get('/api/v1/cartData', (req, res) => {
    const data = {
        totalPrice: totalPrice,
        productCart: productCart
    };

    console.log(data);
    res.send(data);
});

app.post('/api/v1/cartData', (req, res) => {
    let good = req.body.orderItem;
    good.id = id++;

    productCart.push(good);
    totalPrice += good.price;

    clearTimeout(cartTimeout);

    cartTimeout = setTimeout(() => {
        productCart = [];
        totalPrice = 0;
    }, 108e4);

    res.send(good)
});

app.delete('/api/v1/cartData/:id', (req, res) => {
    const index = productCart.findIndex((product) => {
        return product.id == req.params.id
    });

    if (index === -1) return res.sendStatus(404);

    totalPrice -= productCart[index].price;
    productCart.splice(index, 1);

    res.sendStatus(204);
});

app.listen(app.get('port'), () => console.log(`Server is listening: http://localhost:${app.get('port')}`));



