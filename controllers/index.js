/* Archivo Cargar automaticamente todos los controladores dentro de la carpeta */
var fs = require('fs');  
var path = require('path');

/* Leer el directorio actual y guardar los controladores en la variable files */
var files = fs.readdirSync(__dirname);

/* Recorrer la variable files */
files.forEach(function(file){
	/* cargamos el nombre del archivo con la extension js */
	var fileName = path.basename(file, '.js');
	 /* exporto los controladores que existan diferentes de index */
	if(fileName !== 'index'){
	
		exports[fileName] = require('./'+fileName);
	}
	
})