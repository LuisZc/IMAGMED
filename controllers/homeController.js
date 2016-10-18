/* //Devuelve la vista del inicio */
/* Exposta todo lo que este en module. exports */
module.exports = {
	
	index : function(req, res, next){
		res.render('home',{
			
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}
}