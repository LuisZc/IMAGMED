//module.exports = {
//currentDate: function(){

	exports.currentDate= function(){
       var hoy= new Date();
          var dd= hoy.getDate();
          var mm= hoy.getMonth();
          var yy= hoy.getFullYear();
          hoy=mm+'/'+dd+'/'+yy;

          return "hola";
    }
//}