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

router.get('/users/doctors', controllers.UserController.getNewDoctor);
router.post('/users/doctors', controllers.UserController.postNewDoctor);

router.get('/auth/logout', controllers.UserController.logout);
router.get('/users/panel', AuthMiddleware.isLogged ,controllers.UserController.getUserPanel);
router.get('/users/menu', AuthMiddleware.isLogged,controllers.ImgController.getEntryImg);
router.get('/users/views',AuthMiddleware.isLogged, controllers.ImgController.getViewImg);
router.post('/users/saved',AuthMiddleware.isLogged,controllers.ImgController.postEntryImgDb);
router.post('/users/save',AuthMiddleware.isLogged,controllers.ImgController.postEntryImg);
router.post('/users/views2', controllers.ImgController.postViewImg);

router.get('/users/viewarea',AuthMiddleware.isLogged, controllers.ImgController.getViewImgArea);
router.post('/users/viewarea2', controllers.ImgController.postViewImgArea);
router.get('/users/viewtechnique',AuthMiddleware.isLogged, controllers.ImgController.getViewImgTechnique);
router.post('/users/viewtechnique2', controllers.ImgController.postViewImgTechnique);
router.get('/users/viewprocess',AuthMiddleware.isLogged, controllers.ImgController.getViewImgProcess);
router.post('/users/viewprocess2', controllers.ImgController.postViewImgProcess);
/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

module.exports = router;
