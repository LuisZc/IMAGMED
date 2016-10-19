var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('.././controllers');
var AuthMiddleware = require('.././middleware/auth');

router.get('/', controllers.homeController.index);

/* // Rutas de Usuario */
router.get('/auth/signup', controllers.UserController.getSignUp);

router.post('/auth/signup', controllers.UserController.postSignUp);

router.get('/auth/signin', controllers.UserController.getSignIn);

router.post('/auth/signin', passport.authenticate('local', {
      successRedirect : '/users/panel',
      failureRedirect : '/auth/signin',
      failureFlash : true
}));

//Rutas Pacientes

router.get('/users/patients', controllers.UserController.getNewPatient);

router.post('/users/patients', controllers.UserController.postNewPatient);

router.get('/auth/logout', controllers.UserController.logout);
router.get('/users/panel', AuthMiddleware.isLogged ,controllers.UserController.getUserPanel);
router.get('/users/menu', controllers.ImgController.getEntryImg);
router.get('/users/views', controllers.ImgController.getViewImg);
router.post('/users/saved', controllers.ImgController.postEntryImgDb);
router.post('/users/save', controllers.ImgController.postEntryImg);
router.post('/users/views2', controllers.ImgController.postViewImg);

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

module.exports = router;
