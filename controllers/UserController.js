var bcrypt = require('bcryptjs')


module.exports = {
	getSignUp : function(req, res, next){
		return res.render('users/signup');
	},
	
	getNewPatient : function(req, res, next){
		return res.render('users/patient');
	},

	postNewPatient: function(req, res, next){
		//console.log(req.body);
		//var salt = bcrypt.genSaltSync(10);
		//var password = bcrypt.hashSync(req.body.password, salt);
        var session = require('.././database/config');
         var name = req.body.nomape;
         var age =  req.body.edad;
         var gender =  req.body.genero;
         var nationality =  req.body.nacionalidad;
         var civil_stt =  req.body.estcivil;
         var ocupation =  req.body.ocupacion;
         var birthplace =  req.body.lugorigen;
         var place_resi =  req.body.lugres;
         var phone =  req.body.telefono;
       // var password = req.body.password;
         //console.log(password);
        console.log(session);
        session
        .run('CREATE(ptn:Patient {name:{nameParam}, age:{ageParam}, gender:{genderParam}, nationality:{nationalityParam}, civil_stt:{civil_sttParam},ocupation:{ocupationParam}, birthplace:{birthplaceParam}, place_resi:{place_resiParam},phone:{phoneParam}})', {nameParam:name, ageParam:age, genderParam:gender, nationalityParam:nationality,civil_sttParam:civil_stt, ocupationParam:ocupation, birthplaceParam:birthplace,place_resiParam:place_resi,phoneParam:phone})
        .then(function(result){
		  // req.flash('info', 'Se ha registrado correctamente ya puede iniiar session');
		  //req.flash('info', 'Se ha registrado exitosamente el paciente')
		   res.redirect('/users/patients');
		   session.close();
	   })
        .catch(function(err){
        	console.log('error esta dando');
		   console.log(err);
	   });   
          //res.redirect('/');
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