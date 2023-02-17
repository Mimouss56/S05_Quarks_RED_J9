const express = require('express');
const controller = require('./controllers/mainController');

const router = express.Router();

router.get('/', controller.home);

router.get('/product/:id', controller.product);

router.get('/brands', controller.brands)

module.exports = router;