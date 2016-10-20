var fs=require('fs');


module.exports = {
	getEntryImg: function(req, res, next){

     var session = require('.././database/config');
    session
    .run('MATCH(ptn:Patient) RETURN ptn.name')
    .then(function(result){
      var namePtnArr = [];
     //console.log(result);
      result.records.forEach(function(record){
         namePtnArr.push({
            //id: record._fields[0].identity.low,
            name: record._fields[0]
          // area:record._fields[0].properties.type
         });
      });

      res.render('users/entryImg',{
            isAuthenticated : req.isAuthenticated(),
            user : req.user,
            names: namePtnArr
           });
      
         session.close();

    })
    .catch(function(err){
      console.log(err);
    });

           
	 },
   postEntryImg:function(req, res, next){
      var img_orgn = req.body.archivo.path.split("_").pop(); 
      console.log(req.body.observaciones);
          res.render('users/savedImg',{
            isAuthenticated : req.isAuthenticated(),
            user : req.user,
            paciente: req.body.selectpicker1,
            tipovista: req.body.tipovista,
            area: req.body.area,
            tecnica: req.body.tecnica,
            procedimiento: req.body.procedimiento,
            enfoque: req.body.enfoque,
            observaciones: req.body.observaciones,
            img: img_orgn
           });
      

   },
	 postEntryImgDb:function(req, res, next){
    var paciente = req.body.paciente;
    var vista = req.body.tipovista;
    var area = req.body.area;
    var tecnica = req.body.tecnica;
    var procedimiento = req.body.procedimiento;
    var enfoque= req.body.enfoque;
    var observaciones = req.body.observaciones;
    var doctor= req.body.doctorname;
    console.log(paciente);
    console.log(doctor);
    
    var session = require('.././database/config');
    var img_original ='public/uploads/upload_'+req.body.img;
    //;console.log(img_original);
   fs.readFile(img_original, function(err, original_data){
         fs.writeFile('image_orig.jpg', original_data, function(err) {});
         var base64Image = original_data.toString('base64');
         //console.log(base64Image);
         session
        .run('CREATE(img:Image {vista:{vistaParam}, area:{areaParam}, base64:{base64Param}, tecnica:{tecnicaParam}, procedimiento:{procedimientoParam}, enfoque:{enfoqueParam}, observaciones:{observacionesParam}})',{vistaParam:vista, areaParam:area, base64Param:base64Image,tecnicaParam:tecnica, procedimientoParam:procedimiento, enfoqueParam:enfoque, observacionesParam:observaciones})
         //   .run('CREATE(img:Image {base64:{base64Param}, type:{typeParam}})',{base64Param: base64Image,typeParam: tipo})
      
         .then(function(result){
             session
             .run('MATCH(ptn:Patient {name:{patientParam}}), (img:Image {base64:{base64Param}}), (dr:Doctor {name:{doctorParam}}) MERGE(dr)-[rsp:responsable]->(img)-[blg:belongs]->(ptn)', {patientParam:paciente, base64Param:base64Image, doctorParam:doctor })
             .then(function(result1){
                fs.unlink(img_original, function(err){
                 res.redirect('/users/menu');
                 session.close();
               });
              })
             .catch(function(err){
                console.log("Error 2");
                console.log(err);
                });
             
               
               
         })
         .catch(function(err){
          console.log(err);
         }
          );
      //   var decodedImage = new Buffer(base64Image, 'base64');
       // fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
       // res.render('users/savedImg');
       
});  


         //  console.log(req.body.archivo.path);
         //  console.log(req.body.archivo.type);
      //    var img_orgn = req.body.archivo.path; 
         
      /**   fs.readFile(img_orgn, function(err, original_data){
         fs.writeFile('image_orig.jpg', original_data, function(err) {});
         var base64Image = original_data.toString('base64');
      //   var base64Image = new Buffer(original_data, 'binary').toString('base64');
         //console.log(base64Image);
         var decodedImage = new Buffer(base64Image, 'base64');
        fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
       // res.render('users/savedImg');
       
});  **/


         // var tmp_path = req.files.miarchivo.path;
       //   var tipo = req.files.miarchivo.type;
        //  if(tipo=='image/png' || tipo=='image/jpg' || tipo=='image/jpeg' ){
        //      var nombrearchivo=req.files.miarchivo.name;
        //      var target_path = './public/uploads/'+nombrearchivo;
         //     fs.rename(tmp_path, target_path, function(err){
            //     fs.unlink(tmp_path, target_path, function(err){
            //           res.send('El archivo se subio correctamente');
            //     });
             // });

         // }else{
         // 	res.send('Archivo no valido.');
         // }
	 },
   getViewImg: function(req, res, next){
    var session = require('.././database/config');
    session
    .run('MATCH(ptn:Patient) RETURN ptn.name')
   //.run('MATCH(img:Image) RETURN img LIMIT 25')
    .then(function(result){
      var namePtnArr = [];
     console.log(result);
      result.records.forEach(function(record){
         namePtnArr.push({
            //id: record._fields[0].identity.low,
            name: record._fields[0]
          // area:record._fields[0].properties.type
         });
      });
      console.log(namePtnArr);
      res.render('users/viewImg',{
           // isAuthenticated : req.isAuthenticated(),
          //  user : req.user,
            names: namePtnArr
           });
      session.close();

    })
    .catch(function(err){
      console.log(err);
    });
           
   },
   postViewImg: function(req, res, next){
    var area = req.body.selectpickerArea;
    console.log(area);
    var session = require('.././database/config');
    session
    .run('MATCH(img:Image) WHERE img.area={areaParam} RETURN img.base64',{areaParam: area})
    .then(function(result){
      var resultado;
      result.records.forEach(function(record){
         resultado= record._fields[0]
      });
      res.render('users/viewImg2',{
        imgArea: area, 
        resultado: resultado
    });
       console.log(resultado);
    })
    .catch(function(err){
      console.log(err);
    });
    
   }

}