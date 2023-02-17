const {
  Product,
  Brand
} = require('../models');

const {
  Op
} = require('sequelize');

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
  }

};

module.exports = controller;