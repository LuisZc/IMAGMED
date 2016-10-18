var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

module.exports = function(passport){

   passport.serializeUser(function(user,done){
          done(null, user);

   });

   passport.deserializeUser(function(obj, done){
   	done(null, obj);

   });

   passport.use(new LocalStrategy({
          passReqToCallBack : true
   }, function(user, email, done){
   	var session = require('.././database/config');
         
         console.log(email);
        //  console.log(password);
         // console.log(done);
          session
		 .run('match(usr:User)  where usr.email="'+user+'" return usr LIMIT 25')
		 .then(function(result2){
			 var userArr = [];
			 console.log(result2);
			 result2.records.forEach(function(record){
				 userArr.push({
					 id: record._fields[0].identity.low,
					 username: record._fields[0].properties.username,
					 email: record._fields[0].properties.email

					 
				 });
				 if(bcrypt.compareSync(email,  record._fields[0].properties.password)){
                       console.log('El Password es correcto');
                       return done(null, {
                              id: record._fields[0].identity.low,
					          nombre: record._fields[0].properties.username,
					          email: record._fields[0].properties.email
                       });
                       session.close();

				 }
				 console.log('El password es Incorrect')
				 return done(null, false);
				 session.close();
					
			 }

			 );
			/// res.render('index', {
			//           actors: actorArr
		    //        });
			 
		 })
		 .catch(function(err){
			 console.log(err);
		 });
          
   }
   ));
};