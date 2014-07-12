Template.home.events({
	"click .login-facebook": function(e, t){
		Meteor.loginWithFacebook();
	},
	"click .login-google": function(e, t){
		Meteor.loginWithGoogle();
	},
	"click .login-linkedin": function(e, t){
		Meteor.loginWithLinkedin();
	}
})