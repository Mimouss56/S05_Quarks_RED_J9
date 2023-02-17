const {
  Product,
  Brand
} = require('../models');

const controller = {
  home: async function (req, res) {
    const data = await Product.findAll();
    res.render('home', {
      products: data,
    });
  },
  product: async function (req, res) {
    const id = req.params.id;
    const product = await Product.findByPk(id, {
      include: 'brand',
    });
    res.render('product', {
      product: product,
    });
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
  }

};

module.exports = controller;