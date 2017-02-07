var bcrypt = require('bcryptjs')
var passport = require('passport')

module.exports = {
	getSignUp : function(req, res, next){
		var session = require('.././database/config');
    session
    .run('MATCH(dr:Doctor) RETURN dr.name')
   //.run('MATCH(img:Image) RETURN img LIMIT 25')
    .then(function(result){
      var areaNameArr = [];
     console.log(result);
      result.records.forEach(function(record){
         areaNameArr.push({
            //id: record._fields[0].identity.low,
            name: record._fields[0]
          // area:record._fields[0].properties.type
         });
      });
      console.log(areaNameArr);
      res.render('users/signup',{
            isAuthenticated : req.isAuthenticated(),
            user : req.user,
            names: areaNameArr
           });
      session.close();

    })
    .catch(function(err){
      console.log(err);
    });
		//return res.render('users/signup');
	},
	
	getNewPatient : function(req, res, next){
		return res.render('users/patient',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
    });
	},

	postNewPatient: function(req, res, next){
		//console.log(req.body);
		//var salt = bcrypt.genSaltSync(10);
		//var password = bcrypt.hashSync(req.body.password, salt);
        var session = require('.././database/config');
         var name = req.body.nomape;
         var birthdate =  req.body.birthdate;
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
        .run('CREATE(ptn:Patient {name:{nameParam}, birthdate:{birthdateParam}, gender:{genderParam}, nationality:{nationalityParam}, civil_stt:{civil_sttParam},ocupation:{ocupationParam}, birthplace:{birthplaceParam}, place_resi:{place_resiParam},phone:{phoneParam}})', {nameParam:name, birthdateParam:birthdate, genderParam:gender, nationalityParam:nationality,civil_sttParam:civil_stt, ocupationParam:ocupation, birthplaceParam:birthplace,place_resiParam:place_resi,phoneParam:phone})
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
	getNewDoctor: function(req, res, next){
    var session = require('.././database/config');
                 session
                  .run('MATCH(ar:Area) RETURN ar.type')
                  .then(function(result){
                   var typeArArr = [];
                   result.records.forEach(function(record){
                   typeArArr.push({
                   typear: record._fields[0]
          
                   });
                  });
                     session
                    .run('MATCH(sp:Specialty) RETURN sp.namesp')
                    .then(function(result){
                         var nameSpArr = [];
                         result.records.forEach(function(record){
                         nameSpArr.push({
                         namesp: record._fields[0]
          
                         });
                        });

                        res.render('users/doctor',{
                       isAuthenticated : req.isAuthenticated(),
                       user : req.user,
                       typesAr: typeArArr,
                       nameSpArr: nameSpArr
                       });
                        session.close();
                    })
                    .catch(function(err){
                     console.log(err);
                     });
                   
      
                  session.close();

                 })
                 .catch(function(err){
                  console.log(err);
                  });
   //     return res.render('users/doctor',{
   //        isAuthenticated : req.isAuthenticated(),
   //        user : req.user
    //    });
	},
	postNewDoctor: function(req, res, next){
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.password, salt);
		var session = require('.././database/config');
         var profile="DOCTOR";
         var name = req.body.nomape;
         var birthdate =  req.body.birthdate;
         var gender =  req.body.genero;
         var identity_card =  req.body.cedula;
         var area= req.body.area;
         var specialty= req.body.especialidad;
         var email =  req.body.email;
         console.log(birthdate);
         session
         .run('CREATE(dr:Doctor {name:{nameParam}, birthdate:{birthdateParam}, gender:{genderParam}, identity_card:{identity_cardParam}})', {nameParam:name, birthdateParam:birthdate, genderParam:gender, identity_cardParam:identity_card, areaParam:area, specialtyParam:specialty})
         .then(function(result){
         	  session
         	  .run('CREATE(usr:User {username:{usernameParam}, email:{emailParam}, profile:{profileParam}, password:{passwordParam}})', {usernameParam:name, emailParam:email, profileParam:profile, passwordParam:password})
         	  .then(function(result1){
                 session
                 .run('MATCH(dr:Doctor {name:{nameParam}}), (usr:User {username:{nameParam}}), (sp:Specialty {namesp:{specialtyParam}}), (ar:Area {type:{areaParam}}) MERGE(usr)-[blu:belongs_usr]->(dr) MERGE(dr)-[bldrs:belongs_drs]->(sp) MERGE(dr)-[bldra:belongs_dra]->(ar)', {nameParam:name, specialtyParam:specialty, areaParam:area})
                 .then(function(result2){
                       res.redirect('/users/doctors');
		               session.close();
                    })
                 .catch(function(err){
         	     console.log('Esta dando error2');
               	console.log(err);

                 });
         	   })
         	  .catch(function(err){
             	console.log('Esta dando error1');
         	   console.log(err);
   
               });
           

         })
         .catch(function(err){
         	console.log('Esta dando error');
         	console.log(err);

         });

	},

	postSignUp: function(req, res, next){
		//console.log(req.body);
		var salt = bcrypt.genSaltSync(10);
		var password = bcrypt.hashSync(req.body.password, salt);
        var session = require('.././database/config');
         var username = req.body.nombre;
         var email =  req.body.email;
       // var password = req.body.password;
      //   console.log(password);
        //console.log(session);
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
            delete req.session.user;
            res.redirect('/auth/signin');
	},



	 getUserPanel : function(req, res, next){
 
     if(req.user.perfil== 'ADMINISTRATOR'){
        res.render('users/panelsu',{
         isAuthenticated : req.isAuthenticated(),
         user : req.user

       });

     }else{
       res.render('users/panel',{
        isAuthenticated : req.isAuthenticated(),
        user : req.user

       });

     }
	 	
	 },
    getProfile: function(req, res, next){
      var session = require('.././database/config');
      var nombre = req.user.nombre;
      session
      .run('Match (usr:User {username:{nameParam}})-[blu:belongs_usr]->(dr:Doctor {name:{nameParam}})-[bldrs:belongs_drs]->(sp), (dr:Doctor {name:{nameParam}})-[bldra:belongs_dra]->(ar) RETURN usr, dr, sp, ar',{nameParam: nombre})
      .then(function(result){
        var arrayProfile=[];
        result.records.forEach(function(record){
          arrayProfile.push({
            id: record._fields[0].identity.low,
            perfil: record._fields[0].properties.profile,
            nombre: record._fields[0].properties.username,
            email: record._fields[0].properties.email,
            fechana: record._fields[1].properties.birthdate,
            genero: record._fields[1].properties.gender,
            ci: record._fields[1].properties.identity_card,
            especialidad:record._fields[2].properties.namesp,
            area:record._fields[3].properties.type
            

          });
          
        });
        //return res.render('users/signin', {message: req.flash('info'), });
        
        res.render('users/profileuser', {
          isAuthenticated : req.isAuthenticated(),
          message: req.flash('info'),
          user : req.user,
          perfil: arrayProfile
      });

      })
      .catch(function(err){
          console.log('Error Profile');
       console.log(err);
     });
      
     
      },
      postProfile: function(req, res, next){
       var session = require('.././database/config');
       var email = req.user.email;
      
        var oldpassword=req.body.oldpassword;
        var newpassword1=req.body.password;
        var newpassword2=req.body.password1;
        //console.log(oldpassword);
        ///console.log(newpassword1);
        //console.log(newpassword2);
        if(newpassword1 == newpassword2){
          var salt = bcrypt.genSaltSync(10);
         var bcpassword = bcrypt.hashSync(newpassword1, salt);
                  
          session
          .run( 'match(usr:User)  where usr.email={emailParam} return usr ',{emailParam:email})
          .then(function(result){
          
            result.records.forEach(function(record){
               if(bcrypt.compareSync(oldpassword,  record._fields[0].properties.password)){
                  session
                  .run('Match(usr:User)  where usr.email={emailParam} set usr.password={nwpasswordParam} return usr ',{emailParam:email, nwpasswordParam:bcpassword})
                  .then(function(result1){
                     req.flash('info', 'El Cambio de Contrasena se a realizado correctamente');
                     res.redirect('/users/profile');
                     session.close();
                     }
                     
                    )
                  .catch(function(err){
                    console.log(err);
                  });
              
                 session.close();
              
               }else{
                 req.flash('info', 'El Actual Password Ingresado es Incorrecto');
                 res.redirect('/users/profile');
                 session.close();
               }

            });
         
          })
          .catch(function(err){
           console.log(err);
          });
        } //end if
        else{
              req.flash('info', 'El Nuevo password Ingresado no coincide en la confirmación');
              res.redirect('/users/profile');
        }
      //  req.flash('info', 'Se ha registrado exitosamente ya puede iniciar session');
         //res.redirect('/users/profile');
     }

    


	 
}