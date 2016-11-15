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
        .run('CREATE(img:Image {view:{vistaParam}, area:{areaParam}, base64:{base64Param}, technique:{tecnicaParam}, process:{procedimientoParam}, focus:{enfoqueParam}, observations:{observacionesParam}})',{vistaParam:vista, areaParam:area, base64Param:base64Image,tecnicaParam:tecnica, procedimientoParam:procedimiento, enfoqueParam:enfoque, observacionesParam:observaciones})
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
    // console.log(result);
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
    var paciente = req.body.selectpickerPaciente;
    //console.log(area);
    var session = require('.././database/config');
    session
   // .run('MATCH(img:Image) WHERE img.area={areaParam} RETURN img.base64',{areaParam: area})
  //  .run('MATCH(img:Image)-[blg:belongs]-> (ptn:Patient) WHERE ptn.name={pacienteParam} RETURN img, ptn', {pacienteParam: paciente})
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient)WHERE ptn.name={pacienteParam} RETURN img, ptn, dr', {pacienteParam: paciente})
    .then(function(result){
      var imgArr = [];
      
      result.records.forEach(function(record){
         imgArr.push({
          id: record._fields[0].identity.low,
          vista: record._fields[0].properties.view,
          area: record._fields[0].properties.area,
          img: record._fields[0].properties.base64,
          tecnica: record._fields[0].properties.technique,
          proceso: record._fields[0].properties.process,
          enfoque: record._fields[0].properties.focus,
          observaciones: record._fields[0].properties.observations,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name
           
         });
        });
        console.log(imgArr);
      res.render('users/viewImg2',{
        imgPaciente: paciente, 
        images: imgArr
    });
      // console.log(resultado);
    })
    .catch(function(err){
      console.log(err);
    });
    
   },
   
   getViewImgArea: function(req, res, next){
    var session= require('.././database/config');
    session
    .run('MATCH(img:Image) RETURN DISTINCT img.area')
    .then(function(result){
      var areaImgArr =[];
      result.records.forEach(function(record){
        areaImgArr.push({
          area: record._fields[0]
        });
      });

      res.render('users/viewImgArea',{
               areas:areaImgArr
      });
     session.close();
    })
    .catch(function(err){
      console.log(err);
    });
   },
   postViewImgArea: function(req, res, next){
    var area = req.body.selectpickerArea;
    console.log(area);
    var session = require('.././database/config');
    session
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient)WHERE img.area={areaParam} RETURN img, ptn, dr',{areaParam: area})
    .then(function(result){
      var imgArr = [];
        result.records.forEach(function(record){
         imgArr.push({
         id: record._fields[0].identity.low,
          vista: record._fields[0].properties.view,
          area: record._fields[0].properties.area,
          img: record._fields[0].properties.base64,
          tecnica: record._fields[0].properties.technique,
          proceso: record._fields[0].properties.process,
          enfoque: record._fields[0].properties.focus,
          observaciones: record._fields[0].properties.observations,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name
           
         });
        });
         res.render('users/viewImgArea2',{
        imgArea: area, 
        images: imgArr
        });
    })
    .catch(function(err){
      console.log(err);
    });
   },
   getViewImgTechnique: function(req, res, next){
    var session = require('.././database/config');
    session
    .run('MATCH(img:Image) RETURN DISTINCT img.technique')
    .then(function(result){
      var techImgArr =[];
      result.records.forEach(function(record){
        techImgArr.push({
          tech: record._fields[0]
        });
      });

      res.render('users/viewImgTechnique',{
               techs:techImgArr
      });
     session.close();
    })
    .catch(function(err){
      console.log(err);
    });

   },
  postViewImgTechnique: function(req, res, next){
    var technique = req.body.selectpickerTechnique;
    
    var session = require('.././database/config');
    session
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient)WHERE img.technique={techniqueParam} RETURN img, ptn, dr',{techniqueParam: technique})
    .then(function(result){
      var imgArr = [];
        result.records.forEach(function(record){
         imgArr.push({
         id: record._fields[0].identity.low,
          vista: record._fields[0].properties.view,
          area: record._fields[0].properties.area,
          img: record._fields[0].properties.base64,
          tecnica: record._fields[0].properties.technique,
          proceso: record._fields[0].properties.process,
          enfoque: record._fields[0].properties.focus,
          observaciones: record._fields[0].properties.observations,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name
           
         });
        });
         res.render('users/viewImgTechnique2',{
        imgTechnique: technique, 
        images: imgArr
        });
    })
    .catch(function(err){
      console.log(err);
    });
   },
   getViewImgProcess: function(req, res, next){
    var session = require('.././database/config');
    session
    .run('MATCH(img:Image) RETURN DISTINCT img.process')
    .then(function(result){
      var prossImgArr =[];
      result.records.forEach(function(record){
        prossImgArr.push({
          pross: record._fields[0]
        });
      });

      res.render('users/viewImgProcess',{
               process:prossImgArr
      });
     session.close();
    })
    .catch(function(err){
      console.log(err);
    });

   }, 
   postViewImgProcess :function(req, res, next){
    var procss = req.body.selectpickerProcess;
    
    var session = require('.././database/config');
    session
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient)WHERE img.process={processParam} RETURN img, ptn, dr',{processParam: procss})
    .then(function(result){
      var imgArr = [];
        result.records.forEach(function(record){
         imgArr.push({
         id: record._fields[0].identity.low,
          vista: record._fields[0].properties.view,
          area: record._fields[0].properties.area,
          img: record._fields[0].properties.base64,
          tecnica: record._fields[0].properties.technique,
          proceso: record._fields[0].properties.process,
          enfoque: record._fields[0].properties.focus,
          observaciones: record._fields[0].properties.observations,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name
           
         });
        });
         res.render('users/viewImgProcess2',{
        imgProcess: procss, 
        images: imgArr
        });
    })
    .catch(function(err){
      console.log(err);
    });
   }

}