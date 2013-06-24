module.exports = function (compound, List) {
List.beforeSave = function(next){

	console.log("before");
	next();
}

List.afterSave = function(next){
	console.log("after");
	next();
}
};

