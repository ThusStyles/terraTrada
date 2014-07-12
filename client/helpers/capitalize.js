UI.registerHelper("capital", function(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
});

UI.registerHelper("trimmed", function(str, length){
	if(str.length >= length){
		return str.substring(0, length) + "...";
	} else{
		return str;
	}
	
});