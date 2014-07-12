Template.allNotifications.helpers({
	hasNotifications: function(){
		return Notifications.find({ userId: Meteor.userId()}).count() > 0;
	}
});