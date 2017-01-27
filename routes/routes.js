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
router.get('/users/profile', AuthMiddleware.isLogged ,controllers.UserController.getProfile);

router.get('/users/patients',AuthMiddleware.isLogged ,controllers.UserController.getNewPatient);
router.post('/users/patients', AuthMiddleware.isLogged ,controllers.UserController.postNewPatient);

router.get('/users/doctors', AuthMiddleware.isLogged ,controllers.UserController.getNewDoctor);
router.post('/users/doctors', AuthMiddleware.isLogged ,controllers.UserController.postNewDoctor);

router.get('/auth/logout', controllers.UserController.logout);
router.get('/users/panel', AuthMiddleware.isLogged ,controllers.UserController.getUserPanel);
router.get('/users/menu', AuthMiddleware.isLogged,controllers.ImgController.getEntryImg);
router.get('/users/views',AuthMiddleware.isLogged, controllers.ImgController.getViewImg);
router.post('/users/saved',AuthMiddleware.isLogged,controllers.ImgController.postEntryImgDb);
router.post('/users/save',AuthMiddleware.isLogged,controllers.ImgController.postEntryImg);
router.post('/users/views2',AuthMiddleware.isLogged, controllers.ImgController.postViewImg);

router.get('/users/viewarea',AuthMiddleware.isLogged, controllers.ImgController.getViewImgArea);
router.post('/users/viewarea2', controllers.ImgController.postViewImgArea);
router.get('/users/viewtechnique',AuthMiddleware.isLogged, controllers.ImgController.getViewImgTechnique);
router.post('/users/viewtechnique2', controllers.ImgController.postViewImgTechnique);
router.get('/users/viewprocess',AuthMiddleware.isLogged, controllers.ImgController.getViewImgProcess);
router.post('/users/viewprocess2', controllers.ImgController.postViewImgProcess);

router.post('/users/imgobs',AuthMiddleware.isLogged, controllers.ImgController.postAddImgObs);
router.post('/users/svimgobs',AuthMiddleware.isLogged, controllers.ImgController.postSaveImgObs);

//Rutas Admin
router.post('/usersu/nwar', AuthMiddleware.isLogged ,controllers.UsersuController.postNewArea);
router.get('/usersu/nwar', AuthMiddleware.isLogged ,controllers.UsersuController.getNewArea);
router.post('/usersu/nwvw', AuthMiddleware.isLogged ,controllers.UsersuController.postNewView);
router.get('/usersu/nwvw', AuthMiddleware.isLogged ,controllers.UsersuController.getNewView);
router.post('/usersu/nwtch', AuthMiddleware.isLogged ,controllers.UsersuController.postNewTechnique);
router.get('/usersu/nwtch', AuthMiddleware.isLogged ,controllers.UsersuController.getNewTechnique);
router.post('/usersu/nwpr', AuthMiddleware.isLogged ,controllers.UsersuController.postNewProcess);
router.get('/usersu/nwpr', AuthMiddleware.isLogged ,controllers.UsersuController.getNewProcess);
router.post('/usersu/nwspm', AuthMiddleware.isLogged ,controllers.UsersuController.postNewSpecialty);
router.get('/usersu/nwspm', AuthMiddleware.isLogged ,controllers.UsersuController.getNewSpecialty);

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

module.exports = router;
