var request = require('request');
module.exports = {
   getMenuReport: function(req, res, next){
    var session = require('.././database/config');
    session
    .run('MATCH(dr:Doctor) RETURN dr.name')
    .then(function(result){
      var nameDrArr =[];
       result.records.forEach(function(record){
         nameDrArr.push({
            namedoctor: record._fields[0]
          
         });
      });

       session
      .run('MATCH(ptn:Patient) RETURN ptn.name')
      .then(function(result){
       var namePtnArr = [];
        result.records.forEach(function(record){
          namePtnArr.push({
            name: record._fields[0]
          
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
                     res.render('users/reportmenu',{
                       isAuthenticated : req.isAuthenticated(),
                       user : req.user,
                       namesdr:nameDrArr,
                       names: namePtnArr,
                       typesAr: typeArArr,

                       /*typesVw: typeVwArr,
                       typesAr: typeArArr,
                       typesTh: typeThArr,
                       typesPr: typePrArr*/
                       });

              })
           .catch(function(err){
              console.log(err);
           });
    
          })
          .catch(function(err){
         console.log(err);

        });


    })
    .catch(function(err){
      console.log(err);
    });

    

  },
	getReportOne: function(req, res, next){
		var session = require('.././database/config');
		session
		//.run('match(dr:Doctor)-[rps:responsable]->(img:Image) return dr.name, count((dr)-[rps:responsable]->(img)) ')
		.run('match(dr:Doctor)-[rps:responsable]->(img:Image),(dr)-[bldrs:belongs_drs]->(sp:Specialty) return dr.name, count((dr)-[rps:responsable]->(img)), sp.namesp ')
		.then(function(result){
		  var arrDr=[];
		  result.records.forEach(function(record){
            arrDr.push({
            //id: record._fields[0].identity.match(dr:Doctor)-[rps:responsable]->(img:Image),(dr)-[bldrs:belongs_drs]->(sp:Specialty) return dr.name, count((dr)-[rps:responsable]->(img)), sp.namesp,
             name: record._fields[0],
             img:record._fields[1].low,
             especialty:record._fields[2]
             
            });
          });
         console.log(arrDr);
        var data={
      	template:{'shortid':'BJP0QnuPg'},
      	data:{
      		"arrDoc": arrDr
      		//"books": [{
      		//	"name":"The Pro",
      		//	"author":"Luis Carcelen ",
      		//	"sales": 12
      		//},{
      		//	"name":"cronicas",
      		//	"author":"Lenin Padilla",
      		//	"sales": 5
      		//}]

      	},
      	options:{
      		preview:true
      		//language: "es"
      	}

      }
      var options= {
      	uri:'http://localhost:8001/api/report',
      	method: 'POST',
      	json:data
      }
      request(options).pipe(res);


		})
		.catch(function(err){
			console.log('Error en el Reporte One');
			console.log(err);
		});
 
	},


	postReportPtn: function(req, res, next){
		var session = require('.././database/config');
		var paciente = req.body.selectpickerPaciente;
    console.log(paciente);
		session
		//.run('match(dr:Doctor)-[rps:responsable]->(img:Image) return dr.name, count((dr)-[rps:responsable]->(img)) ')
		.run('MATCH(dr:Doctor)-[rsp:responsable]-> (img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations), (img)-[blvw:belongs_vw]->(vw:View), (img)-[blar:belongs_ar]->(ar:Area), (img)-[blpr:belongs_pr]->(pr:Process), (img)-[blth:belongs_th]->(th:Technique) WHERE ptn.name={pacienteParam} RETURN DISTINCT img, ptn, dr, vw,ar, pr,th',{pacienteParam: paciente})
		.then(function(result){
		  var imgArr = [];
      
         result.records.forEach(function(record){
           imgArr.push({
           idimg: record._fields[0].identity.low,
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

/////////////////////********************
   session
       
         .run('MATCH(img:Image)-[blg:belongs]-> (ptn:Patient), (img)<-[blobs:belongs_obs]-(obs:Observations) WHERE ptn.name={pacienteParam} RETURN DISTINCT img, obs',{pacienteParam: paciente})
         .then(function(result){
            var obsArr = [];
      
           result.records.forEach(function(record){
           obsArr.push({
           idobs: record._fields[0].identity.low,
           responsable: record._fields[1].properties.drresponsable,
           dateobs: record._fields[1].properties.date,
           observacion: record._fields[1].properties.observation
           
          });
          });
            
              console.log(obsArr);
        var data={
      	template:{'shortid':'rJEQl2pvx'},
      	data:{
      		"paciente":paciente,
      		"imgArr": imgArr,
      		"obsArrs": obsArr
      	

      	},
      	options:{
      		preview:true      		
      	}

      }
      var options= {
      	uri:'http://localhost:8001/api/report',
      	method: 'POST',
      	json:data
      }
      request(options).pipe(res);
           session.close();
         })
         .catch(function(err){
         console.log(err);
         });
        session.close();


         ///////**************************
      


		})
		.catch(function(err){
			console.log('Error en el Reporte One');
			console.log(err);
		});
 
	},

	postReportImgCrts: function(req, res, next){
		var session = require('.././database/config');
    var caracteristica= req.body.selectpickerCrts;
    if(caracteristica==='AREA'){
		session
		.run('match(dr:Doctor)-[rps:responsable]->(img:Image)-[blar:belongs_ar]->(ar:Area),(dr)-[bldrs:belongs_drs]->(sp:Specialty) return dr.name, sp.namesp,ar.type, count((img)-[blar:belongs_ar]->(ar))')
		.then(function(result){
		  var arrImgCrs=[];
		  result.records.forEach(function(record){
            arrImgCrs.push({
            
             namedoctor: record._fields[0],
             especialtydr:record._fields[1],
             typecrs:record._fields[2],
             numimg:record._fields[3].low
             
            });
          });
         console.log(arrImgCrs);
        var data={
      	template:{'shortid':'rk5AHb0Pg'},
      	data:{
      		"arrImgCrs": arrImgCrs,
          "Crs": caracteristica
      	

      	},
      	options:{
      		preview:true
      		  	}

      }
      var options= {
      	uri:'http://localhost:8001/api/report',
      	method: 'POST',
      	json:data
      }
      request(options).pipe(res);


		})
		.catch(function(err){
			console.log('Error en el Reporte Imagenes por Area');
			console.log(err);
		});
    }
    if(caracteristica==='PROCEDIMIENTO'){
    session
    .run('match(dr:Doctor)-[rps:responsable]->(img:Image)-[blpr:belongs_pr]->(pr:Process),(dr)-[bldrs:belongs_drs]->(sp:Specialty) return dr.name, sp.namesp,pr.type, count((img)-[blpr:belongs_pr]->(pr))')
    .then(function(result){
      var arrImgCrs=[];
      result.records.forEach(function(record){
            arrImgCrs.push({
            
             namedoctor: record._fields[0],
             especialtydr:record._fields[1],
             typecrs:record._fields[2],
             numimg:record._fields[3].low
             
            });
          });
         console.log(arrImgCrs);
        var data={
        template:{'shortid':'rk5AHb0Pg'},
        data:{
          "arrImgCrs": arrImgCrs,
          "Crs": caracteristica
        

        },
        options:{
          preview:true
              }

      }
      var options= {
        uri:'http://localhost:8001/api/report',
        method: 'POST',
        json:data
      }
      request(options).pipe(res);


    })
    .catch(function(err){
      console.log('Error en el Reporte Imagenes por Area');
      console.log(err);
    });
    }
    if(caracteristica==='TECNICA'){
    session
    .run('match(dr:Doctor)-[rps:responsable]->(img:Image)-[blth:belongs_th]->(th:Technique),(dr)-[bldrs:belongs_drs]->(sp:Specialty) return dr.name, sp.namesp,th.type, count((img)-[blth:belongs_th]->(th))')
    .then(function(result){
      var arrImgCrs=[];
      result.records.forEach(function(record){
            arrImgCrs.push({
            
             namedoctor: record._fields[0],
             especialtydr:record._fields[1],
             typecrs:record._fields[2],
             numimg:record._fields[3].low
             
            });
          });
         console.log(arrImgCrs);
        var data={
        template:{'shortid':'rk5AHb0Pg'},
        data:{
          "arrImgCrs": arrImgCrs,
           "Crs": caracteristica

        },
        options:{
          preview:true
              }

      }
      var options= {
        uri:'http://localhost:8001/api/report',
        method: 'POST',
        json:data
      }
      request(options).pipe(res);


    })
    .catch(function(err){
      console.log('Error en el Reporte Imagenes por Area');
      console.log(err);
    });
    }
    

 
	},

  postReportLstPtnDr: function(req, res, next){
		var session = require('.././database/config');
		var namedoctor= req.body.selectpickerDoctor;
		
		session
		.run('match(dr:Doctor)-[rps:responsable]->(img:Image)-[blg:belongs]->(ptn:Patient),(dr)-[bldrs:belongs_drs]->(sp:Specialty) where dr.name={drnameParam} return dr.name, sp.namesp, ptn.name,ptn.gender, count((dr)-[rps:responsable]->(img)-[blg:belongs]->(ptn))',{drnameParam:namedoctor})
		.then(function(result){
		  var lstptn=[];
		  result.records.forEach(function(record){
            lstptn.push({
            
             namedoctor: record._fields[0],
             especialtydr:record._fields[1],
             namepatient:record._fields[2],
             genderpatient:record._fields[3],
             numimg:record._fields[4].low
             
            });
          });
         console.log(lstptn);
        var data={
      	template:{'shortid':'S1CzYfAwx'},
      	data:{
      		"lstptn": lstptn,
      		"namedoctor":namedoctor
      	     

      	},
      	options:{
      		preview:true
      		  	}

      }
      var options= {
      	uri:'http://localhost:8001/api/report',
      	method: 'POST',
      	json:data
      }
      request(options).pipe(res);


		})
		.catch(function(err){
			console.log('Error en el Reporte Imagenes por Area');
			console.log(err);
		});
 
	},
	  getReportLstDr: function(req, res, next){
		var session = require('.././database/config');
		
		
		session
		.run('Match (ar:Area)<-[bldra:belongs_dra]-(dr:Doctor)-[bldrs:belongs_drs]->(sp:Specialty) return dr,ar,sp')
		.then(function(result){
		  var arrDrs=[];
		  result.records.forEach(function(record){
            arrDrs.push({
            
             namedoctor: record._fields[0].properties.name,
             genderdr: record._fields[0].properties.gender,
             birthdatedr: record._fields[0].properties.birthdate,
             typearea:record._fields[1].properties.type,
             specialty:record._fields[2].properties.namesp,
             
             
            });
          });
         console.log(arrDrs);
        var data={
      	template:{'shortid':'ryDTjQADe'},
      	data:{
      		"arrDrs": arrDrs
     	},
      	options:{
      		preview:true
      		  	}

      }
      var options= {
      	uri:'http://localhost:8001/api/report',
      	method: 'POST',
      	json:data
      }
      request(options).pipe(res);


		})
		.catch(function(err){
			console.log('Error en el Reporte Imagenes por Area');
			console.log(err);
		});
 
	}
	
}