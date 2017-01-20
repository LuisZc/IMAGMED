var bcrypt = require('bcryptjs')


module.exports = {

     
  getNewArea : function(req, res, next){
    return res.render('usersu/newarea',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
    });
  },

  postNewArea: function(req, res, next){

        var session = require('.././database/config');
         var type = req.body.typearea;
         var description =  req.body.descriptionar;
      
    
        console.log(session);
        session
        .run('CREATE(ar:Area {type:{typeParam}, description:{descriptionParam}})', {typeParam:type, descriptionParam:description})
        .then(function(result){
      // req.flash('info', 'Se ha registrado correctamente ya puede iniiar session');
      //req.flash('info', 'Se ha registrado exitosamente el paciente')
       res.redirect('/usersu/nwar');
       session.close();
     })
        .catch(function(err){
          console.log('error esta dando');
       console.log(err);
     });   
          
  },
    getNewView : function(req, res, next){
    return res.render('usersu/newview',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
    });
  },

  postNewView: function(req, res, next){

        var session = require('.././database/config');
         var type = req.body.typeview;
         var description =  req.body.descriptionvw;
      
    
        console.log(session);
        session
        .run('CREATE(vw:View {type:{typeParam}, description:{descriptionParam}})', {typeParam:type, descriptionParam:description})
        .then(function(result){
      // req.flash('info', 'Se ha registrado correctamente ya puede iniiar session');
      //req.flash('info', 'Se ha registrado exitosamente el paciente')
       res.redirect('/usersu/nwvw');
       session.close();
     })
        .catch(function(err){
          console.log('error esta dando');
       console.log(err);
     });   
          
  },
      getNewTechnique: function(req, res, next){
    return res.render('usersu/newtechnique',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
    });
  },

  postNewTechnique: function(req, res, next){

        var session = require('.././database/config');
         var type = req.body.typetechnique;
         var description =  req.body.descriptionth;
      
    
        console.log(session);
        session
        .run('CREATE(th:Technique {type:{typeParam}, description:{descriptionParam}})', {typeParam:type, descriptionParam:description})
        .then(function(result){
      // req.flash('info', 'Se ha registrado correctamente ya puede iniiar session');
      //req.flash('info', 'Se ha registrado exitosamente el paciente')
       res.redirect('/usersu/nwtch');
       session.close();
     })
        .catch(function(err){
          console.log('error esta dando');
       console.log(err);
     });   
          
  },
   getNewProcess : function(req, res, next){
    return res.render('usersu/newprocess',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
    });
  },

  postNewProcess: function(req, res, next){

        var session = require('.././database/config');
         var type = req.body.typeprocess;
         var description =  req.body.descriptionpr;
      
    
        console.log(session);
        session
        .run('CREATE(pr:Process {type:{typeParam}, description:{descriptionParam}})', {typeParam:type, descriptionParam:description})
        .then(function(result){
      // req.flash('info', 'Se ha registrado correctamente ya puede iniiar session');
      //req.flash('info', 'Se ha registrado exitosamente el paciente')
       res.redirect('/usersu/nwpr');
       session.close();
     })
        .catch(function(err){
          console.log('error esta dando');
       console.log(err);
     });   
          
  }


    


	 
}