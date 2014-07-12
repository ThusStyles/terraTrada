Meteor.startup(function(){
	Kadira.connect(Meteor.settings.KADIRA_1, Meteor.settings.KADIRA_2);
});
