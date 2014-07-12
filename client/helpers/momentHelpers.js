UI.registerHelper("fromNow", function(epoch){
	return moment(epoch).fromNow();
});

UI.registerHelper("fullDate", function(epoch){
	return moment(epoch).format('MMMM Do YYYY, h:mm a');
});

UI.registerHelper("monthDate", function(epoch){
	return moment(epoch).format('MMMM Do YYYY');
});