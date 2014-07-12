Notifications = new Meteor.Collection("notifications");


Notifications.deny({
	insert: function(userId, doc){
		return true;
	},
	remove: function(userId, doc){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		return true;
	}
});

Meteor.methods({
	updateNotifications: function(){
		Notifications.update({ userId: Meteor.userId()}, { $set: { read: true} }, { multi: true});
	},
	orderNotification: function(obj){
		check(obj, {
			id: String,
			status: String,
			path: String,
			fromId: String
		})
		Orders.update(obj.id, { $set: { status: obj.status}});
		var name = Meteor.user().profile.name;
		Notifications.insert({ 
			url: obj.path,
			userId: obj.fromId,
			message: "Your order from " + name + " has been updated to " + obj.status,
			read: false,
			epoch: new Date().getTime()
		});
	}
})
