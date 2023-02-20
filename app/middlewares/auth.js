const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.render('login', {message : "Vous devez vous authentifier pour accéder à cette ressource"})
    }
}

module.exports = {auth};