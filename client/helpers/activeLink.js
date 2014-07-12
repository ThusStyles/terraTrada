UI.registerHelper("activeLink", function(pathName){
	var current = Router.current();
	var name = current && current.route.name;
	if(name == pathName) return "active";
});

UI.registerHelper("activeEitherLink", function(paths){
	var current = Router.current();
	var name = current && current.route.name;
	var pathArray = paths.split("|");
	for(var i = 0; i < pathArray.length; ++i){
		if(pathArray[i] == name){
			return "active";
		}
	}
});
