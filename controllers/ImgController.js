var fs=require('fs');
var gf=require('.././middleware/globalFuntion');

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

        session
        .run('MATCH(vw:View) RETURN vw.type')
        .then(function(result){
          var typeVwArr = [];
            result.records.forEach(function(record){
            typeVwArr.push({
            typevw: record._fields[0]
          
           });
          });
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
                  .run('MATCH(th:Technique) RETURN th.type')
                  .then(function(result){
                   var typeThArr = [];
                   result.records.forEach(function(record){
                   typeThArr.push({
                   typeth: record._fields[0]
          
                   });
                  });
                     session
                    .run('MATCH(pr:Process) RETURN pr.type')
                    .then(function(result){
                         var typePrArr = [];
                         result.records.forEach(function(record){
                         typePrArr.push({
                         typepr: record._fields[0]
          
                         });
                        });

                        res.render('users/entryImg',{
                       isAuthenticated : req.isAuthenticated(),
                       user : req.user,
                       names: namePtnArr,
                       typesVw: typeVwArr,
                       typesAr: typeArArr,
                       typesTh: typeThArr,
                       typesPr: typePrArr
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

    session.close();
    })
    .catch(function(err){
      console.log(err);
    });

           
	 },
   postEntryImg:function(req, res, next){
      var img_orgn = req.body.archivo.path.split("_").pop(); 
       var hoy= new Date();
          var dd= hoy.getDate();
          var mm= hoy.getMonth()+1;
          var yy= hoy.getFullYear();
          hoy=dd+'/'+mm+'/'+yy;
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
            img: img_orgn,
            fecha: hoy
            
           });
      

   },
	 postEntryImgDb:function(req, res, next){
    var doctor= req.body.doctorname;
    var date = req.body.fecha;
    var paciente = req.body.paciente;
    var vista = req.body.tipovista;
    var area = req.body.area;
    var tecnica = req.body.tecnica;
    var procedimiento = req.body.procedimiento;
    var enfoque= req.body.enfoque;
    var observacion = req.body.observaciones;
    var responsabledr=req.user.nombre;
    console.log(tecnica);
    var session = require('.././database/config');
    var img_original ='public/uploads/upload_'+req.body.img;
    //console.log(img_original);
   fs.readFile(img_original, function(err, original_data){
         fs.writeFile('image_orig.jpg', original_data, function(err) {});
         var base64Image = original_data.toString('base64');
         //console.log(base64Image);
       //  session
                           //.run('CREATE(img:Image {view:{vistaParam}, area:{areaParam}, base64:{base64Param}, technique:{tecnicaParam}, process:{procedimientoParam}, focus:{enfoqueParam}, observations:{observacionesParam}})',{vistaParam:vista, areaParam:area, base64Param:base64Image,tecnicaParam:tecnica, procedimientoParam:procedimiento, enfoqueParam:enfoque, observacionesParam:observaciones})
         //.run('CREATE(imgs:Images {base64:{base64Param}, focus:{enfoqueParam}, date:{dateParam}}) MERGE (obs:Observations {date:{dateParam}})-[blvw:belongs_vw]->(img)',{base64Param:base64Image, enfoqueParam:enfoque, dateParam:date})
                          //  .run('CREATE(img:Image {base64:{base64Param}, focus:{enfoqueParam}, date:{dateParam}}) ',{base64Param:base64Image, enfoqueParam:enfoque, dateParam:date})
         // .then(function(result){
             session
             //.run('MATCH(ptn:Patient {name:{patientParam}}), (img:Image {base64:{base64Param}, date:{dateParam}}), (dr:Doctor {name:{doctorParam}}) MERGE(dr)-[rsp:responsable]->(img)-[blg:belongs]->(ptn)', {patientParam:paciente, base64Param:base64Image, doctorParam:doctor,dateParam:date })
            // .run('MATCH(ptn:Patient {name:{patientParam}}), (img:Image {base64:{base64Param}, date:{dateParam}}), (dr:Doctor {name:{doctorParam}}), (vw:View {type:{typevwParam}}), (ar:Area {type:{typearParam}}), (th:Technique {type:{typethParam}}), (pr:Process {type:{typeprParam}}) MERGE(dr)-[rsp:responsable]->(img)-[blg:belongs]->(ptn) MERGE (img)-[blvw:belongs_vw]->(vw) MERGE (img)-[blar:belongs_ar]->(ar) MERGE (img)-[blth:belongs_th]->(th) MERGE (img)-[blpr:belongs_pr]->(pr)', {patientParam:paciente, base64Param:base64Image, doctorParam:doctor,dateParam:date, typevwParam:vista, typearParam:area, typethParam:tecnica, typeprParam:procedimiento })
           //   .run('MATCH(ptn:Patient {name:{patientParam}}), (img:Image {base64:{base64Param}, date:{dateParam}}), (dr:Doctor {name:{doctorParam}}), (vw:View {type:{typevwParam}}), (ar:Area {type:{typearParam}}), (pr:Process {type:{typeprParam}}), (th:Technique {type:{typethParam}})  MERGE(dr)-[rsp:responsable]->(img)-[blg:belongs]->(ptn) MERGE (img)-[blvw:belongs_vw]->(vw)  MERGE (img)-[blar:belongs_ar]->(ar) MERGE (img)-[blpr:belongs_pr]->(pr) MERGE (img)-[blth:belongs_th]->(th)', {patientParam:paciente, base64Param:base64Image, doctorParam:doctor,dateParam:date, typevwParam:vista, typearParam:area,typeprParam:procedimiento,typethParam:tecnica})
              .run('MATCH(ptn:Patient {name:{patientParam}}), (dr:Doctor {name:{doctorParam}}), (vw:View {type:{typevwParam}}), (ar:Area {type:{typearParam}}), (pr:Process {type:{typeprParam}}), (th:Technique {type:{typethParam}})  MERGE(dr)-[rsp:responsable]->(img:Image {base64:{base64Param}, focus:{enfoqueParam}, date:{dateParam}})-[blg:belongs]->(ptn)  MERGE (obs:Observations {drresponsable:{drresponsableParam}, date:{dateParam}, observation:{observationParam}})-[blobs:belongs_obs]->(img) MERGE (img)-[blvw:belongs_vw]->(vw)  MERGE (img)-[blar:belongs_ar]->(ar) MERGE (img)-[blpr:belongs_pr]->(pr) MERGE (img)-[blth:belongs_th]->(th)', {patientParam:paciente, base64Param:base64Image, doctorParam:doctor,dateParam:date, typevwParam:vista, typearParam:area,typeprParam:procedimiento,typethParam:tecnica,  enfoqueParam:enfoque, drresponsableParam:responsabledr, observationParam:observacion})
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
             
               
               
      //   })
       //  .catch(function(err){
       //   console.log(err);
     //    }
        //  );
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
   postViewImg: function(req, res, next){
    var paciente = req.body.selectpickerPaciente;
    //console.log(area);
    var session = require('.././database/config');
    session
 //    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient)WHERE ptn.name={pacienteParam} RETURN DISTINCT img, ptn, dr', {pacienteParam: paciente})
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations), (img)-[blvw:belongs_vw]->(vw:View), (img)-[blar:belongs_ar]->(ar:Area), (img)-[blpr:belongs_pr]->(pr:Process), (img)-[blth:belongs_th]->(th:Technique) WHERE ptn.name={pacienteParam} RETURN DISTINCT img, ptn, dr, vw,ar, pr,th',{pacienteParam: paciente})
    .then(function(result){
      var imgArr = [];
      
      result.records.forEach(function(record){
         imgArr.push({
          id: record._fields[0].identity.low,
          img: record._fields[0].properties.base64,
          enfoque: record._fields[0].properties.focus,
          dateimg: record._fields[0].properties.date,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name,
          vista: record._fields[3].properties.type,
          area: record._fields[4].properties.type,
          proceso: record._fields[5].properties.type,
          tecnica: record._fields[6].properties.type
         
         });
        });
         session
        // .run('MATCH(obs:Observations)-[blobs:belongs_obs]-> (img:Image)-[blg:belongs]-> (ptn:Patient) WHERE ptn.name={pacienteParam} RETURN DISTINCT obs, img',{pacienteParam: paciente})
         .run('MATCH(img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations) WHERE ptn.name={pacienteParam} RETURN DISTINCT img, obs',{pacienteParam: paciente})
         .then(function(result){
            var obsArr = [];
      
           result.records.forEach(function(record){
           obsArr.push({
           id: record._fields[0].identity.low,
           responsable: record._fields[1].properties.drresponsable,
           dateobs: record._fields[1].properties.date,
           observacion: record._fields[1].properties.observation
           
          });
          });
            
           res.render('users/viewImg2',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user,
           imgPaciente: paciente, 
           images: imgArr,
           obsv: obsArr
           });
           console.log(obsArr);
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
    
   },
   
   getViewImgArea: function(req, res, next){
    var session= require('.././database/config');
    session
    .run('MATCH(ar:Area) RETURN DISTINCT ar.type')
    .then(function(result){
      var areaImgArr =[];
      result.records.forEach(function(record){
        areaImgArr.push({
          area: record._fields[0]
        });
      });

      res.render('users/viewImgArea',{
               isAuthenticated : req.isAuthenticated(),
               user : req.user,
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
  //  .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient)WHERE img.area={areaParam} RETURN img, ptn, dr',{areaParam: area})
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations), (img)-[blvw:belongs_vw]->(vw:View), (img)-[blar:belongs_ar]->(ar:Area), (img)-[blpr:belongs_pr]->(pr:Process), (img)-[blth:belongs_th]->(th:Technique) WHERE ar.type={areaParam} RETURN DISTINCT img, ptn, dr, vw,ar, pr,th',{areaParam: area})
    .then(function(result){
      var imgArr = [];
        result.records.forEach(function(record){
         imgArr.push({
          id: record._fields[0].identity.low,
          img: record._fields[0].properties.base64,
          enfoque: record._fields[0].properties.focus,
          dateimg: record._fields[0].properties.date,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name,
          vista: record._fields[3].properties.type,
          area: record._fields[4].properties.type,
          proceso: record._fields[5].properties.type,
          tecnica: record._fields[6].properties.type
           
         });
        });

           session
         .run('MATCH(img:Image)-[blg:belongs]-> (ptn:Patient),(obs:Observations) -[blobs:belongs_obs]->(img)-[blar:belongs_ar]->(ar:Area) WHERE ar.type={areaParam} RETURN DISTINCT img, obs',{areaParam: area})
         .then(function(result){
            var obsArr = [];
      
           result.records.forEach(function(record){
           obsArr.push({
           id: record._fields[0].identity.low,
           responsable: record._fields[1].properties.drresponsable,
           dateobs: record._fields[1].properties.date,
           observacion: record._fields[1].properties.observation
           
          });
          });
            res.render('users/viewImgArea2',{
            isAuthenticated : req.isAuthenticated(),
            user : req.user,
            imgArea: area, 
            images: imgArr,
            obsv: obsArr
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
   },
   getViewImgTechnique: function(req, res, next){
    var session = require('.././database/config');
    session
    .run('MATCH(th:Technique) RETURN DISTINCT th.type')
    .then(function(result){
      var techImgArr =[];
      result.records.forEach(function(record){
        techImgArr.push({
          tech: record._fields[0]
        });
      });

      res.render('users/viewImgTechnique',{
               isAuthenticated : req.isAuthenticated(),
               user : req.user,
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
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations), (img)-[blvw:belongs_vw]->(vw:View), (img)-[blar:belongs_ar]->(ar:Area), (img)-[blpr:belongs_pr]->(pr:Process), (img)-[blth:belongs_th]->(th:Technique) WHERE th.type={techniqueParam} RETURN DISTINCT img, ptn, dr, vw,ar, pr,th',{techniqueParam: technique})
    .then(function(result){
      var imgArr = [];
        result.records.forEach(function(record){
         imgArr.push({
           id: record._fields[0].identity.low,
          img: record._fields[0].properties.base64,
          enfoque: record._fields[0].properties.focus,
          dateimg: record._fields[0].properties.date,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name,
          vista: record._fields[3].properties.type,
          area: record._fields[4].properties.type,
          proceso: record._fields[5].properties.type,
          tecnica: record._fields[6].properties.type
           
         });
        });

          session
         .run('MATCH(img:Image)-[blg:belongs]-> (ptn:Patient),(obs:Observations) -[blobs:belongs_obs]->(img)-[blth:belongs_th]->(th:Technique) WHERE th.type={techniqueParam} RETURN DISTINCT img, obs',{techniqueParam: technique})
         .then(function(result){
            var obsArr = [];
      
           result.records.forEach(function(record){
           obsArr.push({
           id: record._fields[0].identity.low,
           responsable: record._fields[1].properties.drresponsable,
           dateobs: record._fields[1].properties.date,
           observacion: record._fields[1].properties.observation
           
          });
          });
              res.render('users/viewImgTechnique2',{
              isAuthenticated : req.isAuthenticated(),
              user : req.user,
              imgTechnique: technique, 
             images: imgArr,
              obsv: obsArr
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
   },
   getViewImgProcess: function(req, res, next){
    var session = require('.././database/config');
    session
    .run('MATCH(pr:Process) RETURN DISTINCT pr.type')
    .then(function(result){
      var prossImgArr =[];
      result.records.forEach(function(record){
        prossImgArr.push({
          pross: record._fields[0]
        });
      });

      res.render('users/viewImgProcess',{
               isAuthenticated : req.isAuthenticated(),
               user : req.user,
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
    .run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations), (img)-[blvw:belongs_vw]->(vw:View), (img)-[blar:belongs_ar]->(ar:Area), (img)-[blpr:belongs_pr]->(pr:Process), (img)-[blth:belongs_th]->(th:Technique) WHERE pr.type={processParam} RETURN DISTINCT img, ptn, dr, vw,ar, pr,th',{processParam: procss})
    .then(function(result){
      var imgArr = [];
        result.records.forEach(function(record){
         imgArr.push({
          id: record._fields[0].identity.low,
          img: record._fields[0].properties.base64,
          enfoque: record._fields[0].properties.focus,
          dateimg: record._fields[0].properties.date,
          name: record._fields[1].properties.name,
          genero: record._fields[1].properties.gender,
          namedoctor: record._fields[2].properties.name,
          vista: record._fields[3].properties.type,
          area: record._fields[4].properties.type,
          proceso: record._fields[5].properties.type,
          tecnica: record._fields[6].properties.type
           
         });
        });

         session
         .run('MATCH(img:Image)-[blg:belongs]-> (ptn:Patient),(obs:Observations) -[blobs:belongs_obs]->(img)-[blpr:belongs_pr]->(pr:Process) WHERE pr.type={processParam} RETURN DISTINCT img, obs',{processParam: procss})
         .then(function(result){
            var obsArr = [];
      
           result.records.forEach(function(record){
           obsArr.push({
           id: record._fields[0].identity.low,
           responsable: record._fields[1].properties.drresponsable,
           dateobs: record._fields[1].properties.date,
           observacion: record._fields[1].properties.observation
           
          });
          });
              res.render('users/viewImgProcess2',{
              isAuthenticated : req.isAuthenticated(),
              user : req.user,
              imgProcess: procss, 
              images: imgArr,
              obsv: obsArr
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
   }, 
   postAddImgObs: function(req, res, next){

    var imagen= req.body.img;
    var doctor = req.body.nameDoctor;
    var paciente = req.body.namePaciente;
    var date = req.body.fechaImg;
    var vista =req.body.vista;
    var area =req.body.area;
    var tecnica= req.body.tecnica;
    var proceso =req.body.proceso;
    var enfoque= req.body.enfoque;
    var hoy= new Date();
          var dd= hoy.getDate();
          var mm= hoy.getMonth()+1;
          var yy= hoy.getFullYear();
          hoy=dd+'/'+mm+'/'+yy;
    var session = require('.././database/config');
    session
    .run('MATCH(dr:Doctor)-[rsp:responsable]->(img:Image)-[blg:belongs]-> (ptn:Patient),(obs:Observations) -[blobs:belongs_obs]->(img)-[blpr:belongs_pr]->(pr:Process) WHERE ptn.name={pacienteParam} AND dr.name={doctorParam} AND img.date={dateParam} AND img.base64={base64Param} RETURN DISTINCT obs',{pacienteParam: paciente, doctorParam:doctor,dateParam:date, base64Param:imagen})
    .then(function(result){
        var obsArr = [];
      
           result.records.forEach(function(record){
           obsArr.push({
           responsable: record._fields[0].properties.drresponsable,
           dateobs: record._fields[0].properties.date,
           observacion: record._fields[0].properties.observation
           
          });
          });
      res.render('users/addObservations',{
                       isAuthenticated : req.isAuthenticated(),
                       user : req.user,
                       img: imagen,
                       namedoctor:doctor,
                       namepaciente: paciente,
                       dateimg: date,
                       vista: vista,
                       area:area,
                       tecnica: tecnica,
                       proceso: proceso,
                       enfoque: enfoque,
                       obsv: obsArr,
                       fecha: hoy
                       });
    })
    .catch(function(err){
      console.log(err);
    });
        
    
   },
   postSaveImgObs: function(req, res, next){
    var session = require('.././database/config');
     var observacion=req.body.observation;
     var responsabledr=req.user.nombre;
     var imagen=req.body.img;
     var doctor=req.body.nameDoctor;
     var paciente=req.body.namePaciente;
     var dateimg= req.body.fechaImg;
     var hoy= new Date();
          var dd= hoy.getDate();
          var mm= hoy.getMonth()+1;
          var yy= hoy.getFullYear();
          hoy=dd+'/'+mm+'/'+yy;
          console.log(imagen);
          console.log(doctor);
          console.log(paciente);
          console.log(dateimg);
      //    console.log(responsable);
          console.log(observacion);

     
    session
    // .run('MATCH(dr:Doctor {name:{doctorParam}})-[rsp:responsable]->(img:Image {base64:{base64Param}, date:{dateImgParam}})-[blg:belongs]-> (ptn:Patient {name:{patientParam}}) MERGE (obs:Observations {responsable:{responsableParam}, date:{dateObsParam}, observation:{observationParam}})-[blobs:belongs_obs]->(img)',{patientParam: paciente, doctorParam:doctor,dateImgParam:dateimg, base64Param:imagen, dateObsParam:hoy, responsableParam:responsable, observationParam:observacion})
  
   // .run('MATCH(dr:Doctor)-[rsp:responsable]->(img:Image)-[blg:belongs]-> (ptn:Patient) WHERE ptn.name={pacienteParam} AND dr.name={doctorParam} AND img.date={dateImgParam} AND img.base64={base64Param} MERGE (obs:Observations {responsable:{responsableParam}, date:{dateObsParam}, observation:{observationParam}})-[blobs:belongs_obs]->(img)',{pacienteParam: paciente, doctorParam:doctor,dateImgParam:dateimg, base64Param:imagen, dateObsParam:hoy, responsableParam:responsable, observationParam:observacion})
    .run('MATCH(dr:Doctor)-[rsp:responsable]->(img:Image)-[blg:belongs]-> (ptn:Patient) WHERE ptn.name={pacienteParam} AND dr.name={doctorParam} AND img.date={dateImgParam} AND img.base64={base64Param} MERGE (obs:Observations {drresponsable:{drresponsableParam}, date:{dateObsParam}, observation:{observationParam}})-[blobs:belongs_obs]->(img)',{pacienteParam: paciente, doctorParam:doctor,dateImgParam:dateimg, dateObsParam:hoy, drresponsableParam:responsabledr, observationParam:observacion, base64Param:imagen})
    .then(function(result){
      res.redirect('/users/views');
      session.close();
    })
    .catch(function(err){
      console.log(err);
      });
   
   },

   getProcessImg:function(req,res,next){
    // res.redirect('/users/processimg');
     return res.render('users/processimg',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
    });

   }



}