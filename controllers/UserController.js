var bcrypt = require('bcryptjs')


module.exports = {
	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},
	
	postSignUp: function(req, res, next){
		//console.log(req.body);
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.password, salt);
        var session = require('.././database/config');
         var username = req.body.nombre;
         var email =  req.body.email;
       // var password = req.body.password;
         console.log(password);
        console.log(session);
        session
        .run('CREATE(usr:User {username:{usernameParam}, email:{emailParam}, password:{passwordParam}})', {usernameParam:username, emailParam:email, passwordParam:password } )
        .then(function(result){
		  // req.flash('info', 'Se ha registrado correctamente ya puede iniiar session');
		  req.flash('info', 'Se ha registrado exitosamente ya puede iniciar session')
		   res.redirect('/auth/signin');
		   session.close();
	   })
        .catch(function(err){
        	console.log('error esta dando');
		   console.log(err);
	   });   
          //res.redirect('/');
	},
	//Metodos para Ingresar
	getSignIn: function(req, res, next){
          return res.render('users/signin', {message: req.flash('info'), });
	},

	logout: function(req, res, next){
            req.logout();
            res.redirect('/auth/signin');
	},

	 getUserPanel : function(req, res, next){
	 	res.render('users/panel',{
			isAuthenticated : req.isAuthenticated(),
			user : req.user

		});
	 }

	 
}