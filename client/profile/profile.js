Template.profile.helpers({
	pluralName: function(){
		var name = this.user.profile.name;
		var end = name.slice(-1);
		if(end == "s")
			return name + '\'';
		else
			return name + '\'s';
	},
	pluralFirstName: function(){
		var firstName = this.user.profile.name.split(' ')[0];
		var end = firstName.slice(-1);
		if(end == "s")
			return firstName + '\'';
		else
			return firstName + '\'s';
	}
});