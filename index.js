'use strict';

//https://git.heroku.com/our-natural-beauty-server.git

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const products = require('./api/products');
const categories = require('./api/categories');
const homePageSlides = require('./api/homePageSlides');
const menuLinks = require('./api/menuLinks');
let productCart = [];
let totalPrice = 0;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-cache');
//     next();
// });

app.use((req, res, next) => {
    let origins = [
        'https://our-natural-beauty.herokuapp.com',
        'https://www.our-natural-beauty.herokuapp.com',
        'https://localhost:3000'
    ];

    for(let i = 0; i < origins.length; i++){
        let origin = origins[i];

        if(req.headers.origin.indexOf(origin) !== -1){
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/api/v1/products", (req, res) => {
    res.send(products);
});

app.get("/api/v1/categories", (req, res) => {
    res.send(categories);
});

app.get("/api/v1/homePageSlides", (req, res) => {
    res.send(homePageSlides)
});

app.get("/api/v1/menuLinks", (req, res) => {
    res.send(menuLinks)
});

app.get('/api/v1/cartData', (req, res) => {
    var data = {
        totalPrice: totalPrice,
        productCart: productCart
    };
    res.send(data);
});

app.post('/api/v1/cartData', (req, res) => {
    let good = req.body.orderItem;
    good.id = productCart.length;

    productCart.push(good);
    totalPrice += good.price;

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

/*
    app.get('/api/products', (req, res) => {
     // var data = {
     //     products,
     //     categories,
     //     mainPageSlides,
     //     menuLinks,
     //     totalPrice,
     //     productCart
     // };

     res.send(productCart);
     });

     app.post('/api/products', (req, res) => {
     let good = req.body;
     console.log(good);
     console.log(req.body);

     good.id = productCart.length
     productCart.push(good);
     totalPrice += good.price;

     res.send(good)
     });

     app.delete('/api/products/:id', (req, res) => {
     const product = productCart.find((product) => {
     return product.id != req.params.id
     });

     productCart = productCart.filter((product) => {
     return product.id != req.params.id
     });

     res.send(product)
     });

     app.get('/api/products/:id', (req, res) => {
     const product = productCart.find((product) => {
     return product.id != req.params.id
     });

     res.send(product)
     });

     app.put('/api/products/:id', (req, res) => {
     const productIndex = productCart.findIndex((product) => {
     return product.id != req.params.id
     });
     const productId = productCart[productIndex].id
     productCart[productIndex] = req.body
     productCart[productIndex].id = productId
     res.send(product)
     });
 */



app.listen(app.get('port'), () => console.log(`Server is listening: http://localhost:${app.get('port')}`));