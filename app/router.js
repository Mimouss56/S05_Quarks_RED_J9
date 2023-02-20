const express = require('express');
const controller = require('./controllers/mainController');

const {auth} = require('./middlewares/auth')

const router = express.Router();

router.get('/', controller.home);

router.get('/product/:id', controller.product);

router.get('/brands', auth, controller.brands)

// url : localhost:3030/brand/Universal
router.get('/brands/:name', controller.brand)

router.get('/search', controller.search)

// signup
router.get('/signup', controller.signupPage)
router.post('/signup', controller.signupAction)

// login
router.get('/login', controller.loginPage)
router.post('/login', controller.loginAction)

module.exports = router;