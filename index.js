require('dotenv').config();
const { urlencoded } = require('express');
const express = require('express');
const session = require('express-session')
const router = require('./app/router');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(urlencoded({extended : false}));

// pour tout ce qui est css, img, js, je vais servir de manière statique le contenu de mes fichiers déjà prêts
app.use(express.static('./public'));


app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "Guess it!",
  cookie: {
     secure: false,
     maxAge: (1000 * 60 * 60) // ça fait une heure
  }
}));

app.use(router);

app.listen(3030, () => {
  console.log('Serveur en place sur http://localhost:3030');
});