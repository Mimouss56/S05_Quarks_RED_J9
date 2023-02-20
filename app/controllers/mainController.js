const {
  Product,
  Brand, User
} = require('../models');

const {
  Op
} = require('sequelize');

const validator = require("email-validator");
const bcrypt = require('bcrypt');
const { request } = require('express');

const controller = {
  home: async function (req, res) {
    try {
      const data = await Product.findAll();
      res.render('home', {
        products: data,
      });
    } catch (err) {
      console.log(err);
    }
  },
  product: async function (req, res) {
    try {

      const id = req.params.id;
      const product = await Product.findByPk(id, {
        include: ['brand', 'categories'],
      });
      res.render('product', {
        product: product,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // controller pour la page 'brands' qui va afficher toutes les brands de la db
  brands: async function (req, res) {
    // bloc try/catch pour la gestion d'erreurs
    console.log(req.session);
    try {
      // on récupère via un findAll toutes les données de la table Brand
      const brands = await Brand.findAll({
        // on spécifie que 'lon souhaite récupérer uniquement la colonne 'name'
        attributes: ['name']
      })
      // on render la page 'brands' en lui passant le tableau obtenu de la db
      res.render('brands', {
        brands
      })
    } catch (error) {
      console.log(error)
    }
  },

  //controller pour la page 'brand' qui va nous afficher le nom d'une brand et tous les produits associés
  // url : localhost:3030/brand/Universal
  brand: async function (req, res) {
    try {
      // on récupère d'abord le nom dans les paramètres d'url
      const brandName = req.params.name;
      // puis on recherche via un findOne le Brand qui a ce name
      const brand = await Brand.findOne({
        where: {
          name: brandName
        },
        // on inclue les produits associès à cette brand
        include: 'products'
      })
      console.log(JSON.stringify(brand, null, 2));
      // on retourne la view dynamisée avec la donnée obtenue de la db
      res.render('brand', {
        brand
      })
    } catch (err) {
      console.log(err);
    }
  },

  search: async function (req, res) {
    // ici on vérifie que si l'utilisateur n'a pas encore fait de recherche (donc pas de query title dans l'url) on ne tente pas d'aller chercher des données, juste on affiche la page avec la barre de recherche et la variable 'results' avec une valeur null
    if (!req.query.title) {
      return res.render('search', {
        results: null
      })
    }
    // on récupère le nom que l'utilisateur a rentré dans la barre de recherche
    const queryName = req.query.title.trim();

    const results = await Product.findAll({
      // on va rechercher un produit dont le nom correspond a peu près à ce qui a été tapé par l'utilisateur
      where: {
        // notre/nos produit/s vont devoir respecter la condition suivante :
        title: {
          // ici on a 2 conditions sur la même ligne
          // 1 -> avec l'opérateur iLike la recherche sera insensible à la casse
          // 2 -> le nom devra commencer par le queryName renseigné par l'utilisateur (équivalent d'un string% / [Op.startsWith])
          [Op.iLike]: queryName + '%',
        }
      }
    })

    console.log(JSON.stringify(results, null, 2));


    res.render('search', {
      results
    })
  },

  signupPage: async function(req, res) {
    res.render('signup')
  },

  signupAction: async function(req, res) {
    try {
      console.log(req.body)
      const {username, password, email} = req.body;

      if (!email || !password || !username) {
        throw new Error('Tous les champs doivent être renseignés')
      }
      // si l'email existe déjà dans la db, sequelize renverra une erreur car ça ne respecte pas la contrainte d'unicité sur la colonne email
      
      // Vérifier que l'email est un email correct --> email-validator
      const isEmail = validator.validate(email);

      if (!isEmail) {
        throw new Error('Invalid email');
      }
      // Ne pas enregistrer le password en brut dans la db --> bcrypt pour générer un hash
      const hash = await bcrypt.hash(password, 10);

      // on crée un nouvel objet contenant les propriétés et valeurs à enregistrer dans la db, les noms des propriétés doivent correspondre à des noms de colonnes dans ma db
      const newUser = {
        username: username,
        email: email,
        password: hash,
      }
      // on appelle la méthode create() de sequelize soit en lui passant directement un objet create(newUser) ou en déclarant les propirétés de l'objet directement dans la méthode create({...})
      const createdUser = await User.create({
        username: username,
        email: email,
        password: hash,
      });
      console.log(createdUser);

      if (!createdUser) {
        throw new Error('User not created')
      }
      // si aucune erreur ne survient on render notre page avec un message de feedback pour que l'utilisateur sache que son compte a bien été créé
      res.render('signup', {message : "Utilisateur créé : " + createdUser.username})
    } catch (err) {
      res.render('signup', {message : err})
    }
  },

  loginPage: async function(req, res) {
    res.render('login')
  },

  loginAction: async function(req, res) {
    try {
      console.log(req.body);
      const {email, password} = req.body;
      // vérifier si un utilisateur existe avec cet email
      const user = await User.findOne({
      where : {
        email : email
      }
    })
  
    // si aucun utilisateur n'est trouvé on renvoie une erreur et la fonction s'arrête ici
    if (!user) {
      console.log(user);
      throw new Error('Aucun utilisateur avec cet email')
    }

    // si on a un utilisateur, on compare le hash de la db au password reçu via le form
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Mot de passe incorrect')
    }

    // on enregistre l'utilisateur connecté dan sla session pour pouvoir le retrouver sur chaque requete ensuite (comme par exemple pour le middleware auth)
    req.session.user = user;
    
    res.render('login', {
      message : "Connecté !"
    })
  } catch (err) {
    res.render('login', {
      message : err
    })
  }
  }

};

module.exports = controller;