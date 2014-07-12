Template.notifications.helpers({
	notifications: function(){
		return Notifications.find({ userId: Meteor.userId()}, {sort: {epoch: -1}, limit: 5} );
	},
	hasUnreadNotifications: function(){
		return Notifications.find({ userId: Meteor.userId(), read: false}).count() > 0;
	},
	hasNotifications: function(){
		return Notifications.find({ userId: Meteor.userId()}).count() > 0;
	}
});

Template.notifications.events({
	"click .notificationList": function(e, t){
		Meteor.call("updateNotifications");
	}
});