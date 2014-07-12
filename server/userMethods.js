Meteor.methods({
	checkVerified: function(email){
		check(email, String);
		var user = Meteor.users.findOne({"emails.address": email}) || false;
		return user && !user.emails[0].verified;
	},
	referral: function(userId){
		check(userId, String);
		if(Meteor.users.findOne(userId)){
			Meteor.users.update(userId, { $inc: { terras: 50 } } );
			var toName = Meteor.users.findOne(userId).profile.name;
			var name = Meteor.user().profile.name
			var message = " referred " + name + " and got T50!"
			Notifications.insert({userId: userId, message: "You" + message, read: false, epoch: new Date().getTime()});
			Lives.insert({ message: toName + message, epoch: new Date().getTime()});
		}
	}
});
